import { GraphQLError } from 'graphql';
import type { QueryResolvers } from '../../../types.generated';
import { normalizeProduct } from '../../../nodeResolvers.generated';
import {
  paginateProductsByCursor,
  type ProductFilter,
  type ProductOrderBy,
} from '../../../../../data/db/products';

// Relay Connection パターンのページング。カーソルの中身（filter/orderBy の保持など）は
// data 層で完結させ、Resolver は GraphQL 固有の型を組み立てる役目に集中する。
export const products: NonNullable<QueryResolvers['products']> = async (
  _parent,
  args,
) => {
  const first = Math.max(0, args.first);
  const filter: ProductFilter | null = args.filter
    ? {
        ...(args.filter.category != null
          ? { category: args.filter.category }
          : {}),
      }
    : null;
  const orderBy: ProductOrderBy | null = args.orderBy
    ? {
        field: args.orderBy.field,
        direction: args.orderBy.direction,
      }
    : null;

  try {
    const result = await paginateProductsByCursor({
      first,
      after: args.after ?? null,
      filter,
      orderBy,
    });
    const edges = result.edges.map((edge) => {
      const normalized = normalizeProduct(edge.node);
      if (!normalized) {
        throw new GraphQLError('Failed to normalize product node.');
      }
      return { cursor: edge.cursor, node: normalized };
    });
    return {
      // 各 edge の node も normalize して Global ID/ __typename を整える。
      edges,
      pageInfo: result.pageInfo,
      totalCount: result.totalCount,
    };
  } catch (error) {
    throw new GraphQLError('Failed to paginate products.', {
      originalError: error instanceof Error ? error : undefined,
    });
  }
};
