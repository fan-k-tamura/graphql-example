import type { QueryResolvers } from '../../../types.generated';

export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  args,
  ctx,
) => {
  return ctx.loaders.userWithRelations.load(args.id);
};
