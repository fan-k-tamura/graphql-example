import type { QueryResolvers } from '../../../types.generated';
import { normalizeProduct } from '../../../nodeResolvers.generated';
import { findProductById } from '../../../../../data/db/products';

// 通常の単一取得でも normalizeProduct を通し、Global ID 形式へ揃える。
// こうしておくと node() 経由のレスポンスと完全に同じ ID が得られる。
export const product: NonNullable<QueryResolvers['product']> = async (
  _parent,
  args,
) => {
  return normalizeProduct(await findProductById(args.id));
};
