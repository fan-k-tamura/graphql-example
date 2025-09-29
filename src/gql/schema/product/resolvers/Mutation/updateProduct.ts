import { GraphQLError } from 'graphql';
import type { MutationResolvers } from '../../../types.generated';
import { fromGlobalId } from '../../../base/global-id';
import { normalizeProduct } from '../../../nodeResolvers.generated';
import { updateProduct as updateProductRecord } from '../../../../../data/db/products';
import { publishProductUpdated } from '../../../../subscriptions/event-bus';

// Update は Global ID を受け取り、コアデータの差分更新だけを行う。
export const updateProduct: NonNullable<
  MutationResolvers['updateProduct']
> = async (_parent, args) => {
  const { clientMutationId, id, patch } = args.input;
  const decoded = fromGlobalId(id);
  if (!decoded || decoded.typeName !== 'Product') {
    throw new GraphQLError('Invalid Product ID supplied to updateProduct.');
  }

  const updated = await updateProductRecord(decoded.rawId, {
    name: patch.name ?? undefined,
    price: patch.price ?? undefined,
    description: patch.description ?? undefined,
  });

  if (!updated) {
    throw new GraphQLError(`Product ${decoded.rawId} not found.`);
  }

  const normalized = normalizeProduct(updated);
  if (!normalized) {
    throw new GraphQLError('Failed to normalize updated product.');
  }
  publishProductUpdated(normalized);
  return {
    clientMutationId: clientMutationId ?? null,
    product: normalized,
  };
};

export default updateProduct;
