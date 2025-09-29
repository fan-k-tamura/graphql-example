import { GraphQLError } from 'graphql';
import type { MutationResolvers } from '../../../types.generated';
import { createProductDraft } from '../../../../../data/db/products';
import { normalizeProduct } from '../../../nodeResolvers.generated';
import { publishProductUpdated } from '../../../../subscriptions/event-bus';

// Mutation.createProduct はサンプル用にインメモリ配列へ追加しているだけで、
// 実際の永続化は行っていない。Relay 互換のペイロード構造を示すのが目的。
export const createProduct: NonNullable<
  MutationResolvers['createProduct']
> = async (_parent, args) => {
  const created = await createProductDraft({
    name: args.input.name,
    price: args.input.price,
    description: args.input.description,
  });

  const normalized = normalizeProduct(created);
  if (!normalized) {
    throw new GraphQLError('Failed to normalize created product.');
  }
  publishProductUpdated(normalized);
  return {
    clientMutationId: args.input.clientMutationId ?? null,
    // normalizeProduct は record をコピーするだけ。GraphQL resolver がローカル ID を Global ID に変換する。
    product: normalized,
  };
};

export default createProduct;
