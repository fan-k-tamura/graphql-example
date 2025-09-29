import { GraphQLError } from 'graphql';
import type { MutationResolvers } from '../../../types.generated';
import { fromGlobalId } from '../../../base/global-id';
import { normalizeProduct } from '../../../nodeResolvers.generated';
import { findProductForDelete } from '../../../../../data/db/products';

// deleteProduct は ID を検証し、該当商品の情報を返すだけ。
// サンプルでは実際の削除は行わず、レスポンス構造を示すことにフォーカスしている。
export const deleteProduct: NonNullable<
  MutationResolvers['deleteProduct']
> = async (_parent, args) => {
  const { clientMutationId, id } = args.input;
  const decoded = fromGlobalId(id);
  if (!decoded || decoded.typeName !== 'Product') {
    throw new GraphQLError('Invalid Product ID supplied to deleteProduct.');
  }

  const record = await findProductForDelete(decoded.rawId);

  return {
    clientMutationId: clientMutationId ?? null,
    deletedProductId: id,
    product: record ? normalizeProduct(record) : null,
  };
};

export default deleteProduct;
