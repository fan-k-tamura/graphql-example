import { findUsersWithRelations, type UserWithRelations } from './users';

export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED';

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderRow = {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
};

export type OrderLineWithSubtotal = OrderItem & {
  id: string;
  subtotal: number;
};

export type OrderWithRelations = {
  id: string;
  status: OrderStatus;
  total: number;
  user: UserWithRelations;
  items: OrderLineWithSubtotal[];
};

const ORDERS: OrderRow[] = [
  {
    id: 'order-001',
    userId: 'user-1',
    status: 'DELIVERED',
    items: [
      {
        productId: 'product-premium-beans',
        productName: 'Premium Coffee Beans',
        quantity: 2,
        unitPrice: 3200,
      },
      {
        productId: 'product-press',
        productName: 'French Press',
        quantity: 1,
        unitPrice: 5600,
      },
    ],
  },
  {
    id: 'order-002',
    userId: 'user-2',
    status: 'SHIPPED',
    items: [
      {
        productId: 'product-matcha-set',
        productName: 'Matcha Powder Set',
        quantity: 1,
        unitPrice: 4200,
      },
      {
        productId: 'product-tea-whisk',
        productName: 'Tea Whisk',
        quantity: 2,
        unitPrice: 1800,
      },
    ],
  },
  {
    id: 'order-003',
    userId: 'user-3',
    status: 'PENDING',
    items: [
      {
        productId: 'product-pour-over-kettle',
        productName: 'Pour-over Kettle',
        quantity: 1,
        unitPrice: 7800,
      },
      {
        productId: 'product-ceramic-mug',
        productName: 'Ceramic Mug',
        quantity: 4,
        unitPrice: 1200,
      },
    ],
  },
  {
    id: 'order-004',
    userId: 'user-1',
    status: 'DELIVERED',
    items: [
      {
        productId: 'product-cold-brew-bottle',
        productName: 'Cold Brew Bottle',
        quantity: 1,
        unitPrice: 4600,
      },
      {
        productId: 'product-reusable-straw',
        productName: 'Reusable Straw',
        quantity: 3,
        unitPrice: 600,
      },
    ],
  },
  {
    id: 'order-005',
    userId: 'user-4',
    status: 'PENDING',
    items: [
      {
        productId: 'product-organic-cocoa',
        productName: 'Organic Cocoa',
        quantity: 2,
        unitPrice: 2500,
      },
      {
        productId: 'product-marshmallow-pack',
        productName: 'Marshmallow Pack',
        quantity: 2,
        unitPrice: 900,
      },
    ],
  },
  {
    id: 'order-006',
    userId: 'user-5',
    status: 'SHIPPED',
    items: [
      {
        productId: 'product-herbal-tea',
        productName: 'Herbal Tea Sampler',
        quantity: 1,
        unitPrice: 3800,
      },
      {
        productId: 'product-travel-tumbler',
        productName: 'Travel Tumbler',
        quantity: 1,
        unitPrice: 4200,
      },
    ],
  },
];

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function makeOrderLineId(orderId: string, index: number): string {
  return `${orderId}-line-${index + 1}`;
}

async function hydrateOrders(rows: OrderRow[]): Promise<OrderWithRelations[]> {
  if (rows.length === 0) {
    return [];
  }

  const userIds = Array.from(new Set(rows.map((order) => order.userId)));
  const users = await findUsersWithRelations(userIds);
  const userMap = new Map(users.map((user) => [user.id, user]));

  return rows
    .map((order) => {
      const user = userMap.get(order.userId);
      if (!user) {
        return null;
      }

      const items = order.items.map((item, index) => ({
        ...item,
        id: makeOrderLineId(order.id, index),
        subtotal: item.unitPrice * item.quantity,
      }));

      return {
        id: order.id,
        status: order.status,
        total: calculateTotal(order.items),
        user,
        items,
      };
    })
    .filter((order): order is OrderWithRelations => order != null);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderWithRelations | null> {
  const row = ORDERS.find((order) => order.id === id);
  if (!row) {
    return null;
  }
  row.status = status;
  const [order] = await hydrateOrders([row]);
  return order ?? null;
}

export async function paginateOrdersWithRelations({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}): Promise<{
  items: OrderWithRelations[];
  totalCount: number;
  pageInfo: {
    offset: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const totalCount = ORDERS.length;
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

  const slice = ORDERS.slice(offset, offset + limit);
  const items = await hydrateOrders(slice);
  const hasNextPage = offset + slice.length < totalCount;
  const hasPreviousPage = offset > 0;

  return {
    items,
    totalCount,
    pageInfo: {
      offset,
      limit,
      hasNextPage,
      hasPreviousPage,
    },
  };
}

export async function findOrderWithRelationsById(
  id: string,
): Promise<OrderWithRelations | null> {
  const row = ORDERS.find((order) => order.id === id);
  if (!row) {
    return null;
  }

  const [order] = await hydrateOrders([row]);
  return order ?? null;
}
