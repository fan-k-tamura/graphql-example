import type { QueryResolvers } from '../../../types.generated';

export const users: NonNullable<QueryResolvers['users']> = async (
  _parent,
  args,
  ctx,
) => {
  const ids = args.ids.filter(Boolean);
  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map((id) => ctx.loaders.userWithRelations.load(id)),
  );
  return results.filter(
    (user): user is NonNullable<typeof user> => user != null,
  );
};
