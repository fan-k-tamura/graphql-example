import type { QueryResolvers } from '../../../types.generated';
import { paginateVendors } from '../../../../../data/db/vendors';

export const vendors: NonNullable<QueryResolvers['vendors']> = async (
  _parent,
  args,
) => {
  const offset = Math.max(0, args.offset);
  const limit = Math.max(0, args.limit);

  return paginateVendors({ offset, limit });
};
