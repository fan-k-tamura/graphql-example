import type { QueryResolvers } from '../../../types.generated';
import { paginateOrdersWithRelations } from '../../../../../data/db/orders';

export const orders: NonNullable<QueryResolvers['orders']> = async (
  _parent,
  args,
) => {
  const offset = Math.max(0, args.offset);
  const limit = Math.max(0, args.limit);

  const result = await paginateOrdersWithRelations({ offset, limit });
  return result;
};
