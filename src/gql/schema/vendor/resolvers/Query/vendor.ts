import type { QueryResolvers } from '../../../types.generated';
import { findVendorById } from '../../../../../data/db/vendors';

export const vendor: NonNullable<QueryResolvers['vendor']> = async (
  _parent,
  args,
) => {
  return findVendorById(args.id);
};
