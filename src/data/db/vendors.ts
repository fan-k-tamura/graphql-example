export type VendorRow = {
  id: string;
  name: string;
  category: string;
  location: string;
  contactEmail: string;
  phone: string;
};

const VENDORS: VendorRow[] = [
  {
    id: 'vendor-espresso-supply',
    name: 'Espresso Supply Co.',
    category: 'Equipment',
    location: 'Tokyo',
    contactEmail: 'hello@espresso-supply.example.com',
    phone: '03-1000-2000',
  },
  {
    id: 'vendor-beans-import',
    name: 'Beans Import Partners',
    category: 'Beans',
    location: 'Osaka',
    contactEmail: 'sales@beans-import.example.com',
    phone: '06-3000-4000',
  },
  {
    id: 'vendor-packaging-lab',
    name: 'Packaging Lab',
    category: 'Packaging',
    location: 'Nagoya',
    contactEmail: 'support@packaging-lab.example.com',
    phone: '052-500-6000',
  },
  {
    id: 'vendor-roasting-machines',
    name: 'Roasting Machines JP',
    category: 'Equipment',
    location: 'Fukuoka',
    contactEmail: 'contact@roasting-machines.example.com',
    phone: '092-700-8000',
  },
  {
    id: 'vendor-cafe-interior',
    name: 'Cafe Interior Works',
    category: 'Interior',
    location: 'Sapporo',
    contactEmail: 'info@cafe-interior.example.com',
    phone: '011-900-0100',
  },
  {
    id: 'vendor-sustainable-goods',
    name: 'Sustainable Goods Union',
    category: 'Goods',
    location: 'Kyoto',
    contactEmail: 'team@sustainable-goods.example.com',
    phone: '075-110-2200',
  },
];

export async function findVendorById(id: string): Promise<VendorRow | null> {
  return VENDORS.find((vendor) => vendor.id === id) ?? null;
}

export async function paginateVendors({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}): Promise<{
  items: VendorRow[];
  totalCount: number;
  pageInfo: {
    offset: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const totalCount = VENDORS.length;
  if (limit <= 0 || offset >= totalCount) {
    return {
      items: [],
      totalCount,
      pageInfo: {
        offset,
        limit,
        hasNextPage: false,
        hasPreviousPage: offset > 0,
      },
    };
  }

  const items = VENDORS.slice(offset, offset + limit);
  return {
    items,
    totalCount,
    pageInfo: {
      offset,
      limit,
      hasNextPage: offset + items.length < totalCount,
      hasPreviousPage: offset > 0,
    },
  };
}
