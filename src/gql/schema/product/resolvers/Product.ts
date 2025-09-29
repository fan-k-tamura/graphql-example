import type { ProductResolvers } from '../../types.generated';
import { toGlobalId } from '../../base/global-id';

// Product も Relay Node 対応型。Data 層はローカル ID を返すため、ここで Global ID へ変換する。
export const Product: ProductResolvers = {
  id: (parent) => toGlobalId('Product', parent.id),
};
