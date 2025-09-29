import { findAddressesByUserIds, type AddressRow } from './addresses';
import { findProfilesByUserIds, type ProfileRow } from './profiles';

type UserRow = {
  id: string;
  name: string;
};

export type UserWithRelations = UserRow & {
  addresses: AddressRow[];
  profile: ProfileRow | null;
};

const USERS: UserRow[] = [
  { id: 'user-1', name: 'Taro' },
  { id: 'user-2', name: 'Hanako' },
  { id: 'user-3', name: 'Ken' },
  { id: 'user-4', name: 'Yuki' },
  { id: 'user-5', name: 'Mei' },
];

async function findUsersByIds(ids: readonly string[]): Promise<UserRow[]> {
  return USERS.filter((user) => ids.includes(user.id));
}

export async function updateUserBasic(
  userId: string,
  patch: { name?: string },
): Promise<UserRow | null> {
  const user = USERS.find((item) => item.id === userId);
  if (!user) {
    return null;
  }
  if (patch.name != null) {
    user.name = patch.name;
  }
  return user;
}

export async function findUsersWithRelations(
  ids: readonly string[],
): Promise<UserWithRelations[]> {
  // 疑似的な JOIN をエミュレートし、User + Address + Profile をまとめて取得する
  const users = await findUsersByIds(ids);
  const addresses = await findAddressesByUserIds(ids);
  const profiles = await findProfilesByUserIds(ids);

  const addressMap = new Map<string, AddressRow[]>();
  for (const address of addresses) {
    const list = addressMap.get(address.userId);
    if (list) {
      list.push(address);
    } else {
      addressMap.set(address.userId, [address]);
    }
  }

  const profileMap = new Map(
    profiles.map((profile) => [profile.userId, profile]),
  );

  // SQL なら JOIN 結果をそのまま返すイメージ
  return users.map((user) => ({
    ...user,
    addresses: addressMap.get(user.id) ?? [],
    profile: profileMap.get(user.id) ?? null,
  }));
}
