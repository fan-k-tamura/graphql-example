export type AddressRow = {
  userId: string;
  code: string;
  address: string;
  tel: string;
};

const ADDRESSES: AddressRow[] = [
  { userId: 'user-1', code: '100-0001', address: 'Tokyo', tel: '03-0000-0001' },
  {
    userId: 'user-1',
    code: '100-0002',
    address: 'Saitama',
    tel: '048-0000-0002',
  },
  { userId: 'user-1', code: '100-0003', address: 'Osaka', tel: '06-0000-0003' },
  {
    userId: 'user-2',
    code: '100-0004',
    address: 'Fukuoka',
    tel: '092-0000-0004',
  },
  {
    userId: 'user-3',
    code: '100-0005',
    address: 'Nagoya',
    tel: '052-000-0005',
  },
  {
    userId: 'user-4',
    code: '100-0006',
    address: 'Sapporo',
    tel: '011-000-0006',
  },
  {
    userId: 'user-5',
    code: '100-0007',
    address: 'Sendai',
    tel: '022-000-0007',
  },
];

export async function findAddressesByUserIds(
  ids: readonly string[],
): Promise<AddressRow[]> {
  return ADDRESSES.filter((address) => ids.includes(address.userId));
}

export async function replaceAddressesForUser(
  userId: string,
  entries: Array<{ code: string; address: string; tel: string }>,
): Promise<AddressRow[]> {
  // remove existing entries for user
  for (let index = ADDRESSES.length - 1; index >= 0; index--) {
    if (ADDRESSES[index].userId === userId) {
      ADDRESSES.splice(index, 1);
    }
  }

  const newRows: AddressRow[] = entries.map((entry) => ({ userId, ...entry }));
  ADDRESSES.push(...newRows);
  return newRows;
}
