import { GraphQLError } from 'graphql';
import type { MutationResolvers } from '../../../types.generated';
import { fromGlobalId } from '../../../base/global-id';
import { updateUserBasic } from '../../../../../data/db/users';
import { replaceAddressesForUser } from '../../../../../data/db/addresses';
import {
  upsertProfileForUser,
  deleteProfileForUser,
} from '../../../../../data/db/profiles';

export const updateUserDetails: NonNullable<
  MutationResolvers['updateUserDetails']
> = async (_parent, args, ctx) => {
  const { clientMutationId, userId, userPatch, profilePatch, addresses } =
    args.input;
  const decoded = fromGlobalId(userId);
  if (!decoded || decoded.typeName !== 'User') {
    throw new GraphQLError('Invalid User ID supplied to updateUserDetails.');
  }
  const rawUserId = decoded.rawId;

  if (userPatch?.name) {
    const updated = await updateUserBasic(rawUserId, { name: userPatch.name });
    if (!updated) {
      throw new GraphQLError(`User ${rawUserId} not found.`);
    }
  }

  if (profilePatch) {
    if (profilePatch.clear) {
      await deleteProfileForUser(rawUserId);
    } else {
      await upsertProfileForUser(rawUserId, {
        address: profilePatch.address ?? undefined,
        tel: profilePatch.tel ?? undefined,
      });
    }
  }

  if (addresses) {
    await replaceAddressesForUser(
      rawUserId,
      addresses.map((entry) => ({
        code: entry.code,
        address: entry.address,
        tel: entry.tel,
      })),
    );
  }

  // DataLoader のキャッシュを無効化して更新後の状態を取得
  ctx.loaders.userWithRelations.clear(rawUserId);
  const fresh = await ctx.loaders.userWithRelations.load(rawUserId);
  if (!fresh) {
    throw new GraphQLError(`User ${rawUserId} not found after update.`);
  }

  return {
    clientMutationId: clientMutationId ?? null,
    user: fresh,
  };
};

export default updateUserDetails;
