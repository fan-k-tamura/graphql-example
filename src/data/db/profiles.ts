export type ProfileRow = {
  userId: string;
  address: string;
  tel: string;
};

const PROFILES: ProfileRow[] = [
  { userId: 'user-1', address: 'Tokyo', tel: '03-0000-0001' },
  { userId: 'user-3', address: 'Nagoya', tel: '052-000-0005' },
  { userId: 'user-5', address: 'Sendai', tel: '022-000-0007' },
];

export async function findProfilesByUserIds(
  ids: readonly string[],
): Promise<ProfileRow[]> {
  return PROFILES.filter((profile) => ids.includes(profile.userId));
}

export async function upsertProfileForUser(
  userId: string,
  patch: { address?: string; tel?: string },
): Promise<ProfileRow> {
  let profile = PROFILES.find((item) => item.userId === userId);
  if (!profile) {
    profile = {
      userId,
      address: patch.address ?? '',
      tel: patch.tel ?? '',
    };
    PROFILES.push(profile);
  } else {
    if (patch.address != null) profile.address = patch.address;
    if (patch.tel != null) profile.tel = patch.tel;
  }
  return profile;
}

export async function deleteProfileForUser(userId: string): Promise<void> {
  const index = PROFILES.findIndex((item) => item.userId === userId);
  if (index >= 0) {
    PROFILES.splice(index, 1);
  }
}
