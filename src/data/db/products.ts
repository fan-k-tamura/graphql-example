const PRODUCTS = [
  {
    id: 'product-espresso',
    name: 'Espresso Machine',
    price: 54000,
    description: 'Compact espresso machine with dual boiler.',
    category: 'Equipment',
  },
  {
    id: 'product-premium-beans',
    name: 'Premium Coffee Beans',
    price: 3200,
    description: 'Guatemala Huehuetenango single origin beans (250g).',
    category: 'Beans',
  },
  {
    id: 'product-grinder',
    name: 'Conical Burr Grinder',
    price: 19800,
    description: 'Stainless steel conical burr grinder with 40 settings.',
    category: 'Equipment',
  },
  {
    id: 'product-press',
    name: 'French Press',
    price: 5600,
    description: '1L borosilicate glass French press.',
    category: 'Brewing',
  },
  {
    id: 'product-dripper',
    name: 'Ceramic Dripper Set',
    price: 4800,
    description: 'Ceramic dripper with 40 paper filters included.',
    category: 'Brewing',
  },
  {
    id: 'product-matcha-set',
    name: 'Matcha Powder Set',
    price: 4200,
    description: 'Stone-milled matcha powder with bamboo scoop.',
    category: 'Tea',
  },
  {
    id: 'product-tea-whisk',
    name: 'Tea Whisk',
    price: 1800,
    description: 'Handmade 100-prong bamboo chasen whisk.',
    category: 'Tea',
  },
  {
    id: 'product-pour-over-kettle',
    name: 'Pour-over Kettle',
    price: 7800,
    description: 'Gooseneck kettle with precise flow control.',
    category: 'Equipment',
  },
  {
    id: 'product-ceramic-mug',
    name: 'Ceramic Mug',
    price: 1200,
    description: '350ml ceramic mug with matte glaze.',
    category: 'Goods',
  },
  {
    id: 'product-cold-brew-bottle',
    name: 'Cold Brew Bottle',
    price: 4600,
    description: '1L cold brew bottle with fine mesh filter.',
    category: 'Equipment',
  },
  {
    id: 'product-reusable-straw',
    name: 'Reusable Straw',
    price: 600,
    description: 'Set of 4 stainless steel reusable straws.',
    category: 'Goods',
  },
  {
    id: 'product-organic-cocoa',
    name: 'Organic Cocoa',
    price: 2500,
    description: 'Fair trade organic cocoa powder (300g).',
    category: 'Ingredients',
  },
  {
    id: 'product-marshmallow-pack',
    name: 'Marshmallow Pack',
    price: 900,
    description: 'Vanilla marshmallow pack (200g).',
    category: 'Ingredients',
  },
  {
    id: 'product-herbal-tea',
    name: 'Herbal Tea Sampler',
    price: 3800,
    description: 'Sampler of five caffeine-free herbal teas.',
    category: 'Tea',
  },
  {
    id: 'product-travel-tumbler',
    name: 'Travel Tumbler',
    price: 4200,
    description: 'Vacuum insulated tumbler keeps drinks warm for 6 hours.',
    category: 'Goods',
  },
];

export type ProductRow = (typeof PRODUCTS)[number];

let productSequence = PRODUCTS.length;

export type ProductDraft = {
  name: string;
  price: number;
  description: string;
};

export type ProductUpdatePatch = Partial<ProductDraft>;

const CURSOR_PREFIX = 'product:';

export type ProductOrderDirection = 'ASC' | 'DESC';

export type ProductOrderField = 'NAME' | 'PRICE';

export type ProductOrderBy = {
  // Sort target and direction; cursors must be generated against the same pair to stay valid.
  field: ProductOrderField;
  direction: ProductOrderDirection;
};

export type ProductFilter = {
  category?: string;
};

// The cursor payload encodes the active filter/order and the last seen primary key so that
//   - Relay-style pagination can verify the caller is still on the same query (filter/order match)
//   - The backend can resume scanning from the correct point within that ordered result set.
// Keeping `filter` / `orderBy` nullable lets us reuse the helper even if those parameters are not supplied.
type ProductCursorPayload = {
  filter: ProductFilter | null;
  orderBy: ProductOrderBy | null;
  lastSeenId: string;
};

function encodeProductCursor(payload: ProductCursorPayload): string {
  // Embed filter/order information into the cursor so that Relay-style pagination keeps ordering consistent.
  return Buffer.from(
    `${CURSOR_PREFIX}${JSON.stringify(payload)}`,
    'utf-8',
  ).toString('base64');
}

function decodeProductCursor(cursor: string): ProductCursorPayload {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    if (!decoded.startsWith(CURSOR_PREFIX)) {
      throw new Error('Invalid product cursor prefix.');
    }
    const payload = JSON.parse(
      decoded.slice(CURSOR_PREFIX.length),
    ) as ProductCursorPayload;
    if (!payload || typeof payload.lastSeenId !== 'string') {
      throw new Error('Invalid product cursor payload.');
    }
    return payload;
  } catch (_error) {
    throw new Error('Invalid product cursor.');
  }
}

function makeProductCursor({
  filter,
  orderBy,
  lastSeenId,
}: ProductCursorPayload): string {
  return encodeProductCursor({ filter, orderBy, lastSeenId });
}

export async function findProductById(id: string): Promise<ProductRow | null> {
  return PRODUCTS.find((product) => product.id === id) ?? null;
}

export async function findProductsByIds(
  ids: readonly string[],
): Promise<ProductRow[]> {
  return PRODUCTS.filter((product) => ids.includes(product.id));
}

export async function createProductDraft(
  input: ProductDraft,
): Promise<ProductRow> {
  // In-memory 擬似 DB なので永続化は行わず、配列へ追加して返すだけ。
  const id = `product-custom-${++productSequence}`;
  const newProduct: ProductRow = {
    id,
    name: input.name,
    price: input.price,
    description: input.description,
    category: 'Custom',
  };
  PRODUCTS.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  patch: ProductUpdatePatch,
): Promise<ProductRow | null> {
  const product = PRODUCTS.find((item) => item.id === id);
  if (!product) {
    return null;
  }
  if (patch.name != null) product.name = patch.name;
  if (patch.price != null) product.price = patch.price;
  if (patch.description != null) product.description = patch.description;
  return product;
}

export async function findProductForDelete(
  id: string,
): Promise<ProductRow | null> {
  // サンプルでは実際の削除は行わず、取得したレコードをそのまま返すだけにしている。
  return PRODUCTS.find((item) => item.id === id) ?? null;
}

export async function paginateProductsByCursor({
  first,
  after,
  filter = null,
  orderBy = null,
}: {
  first: number;
  after?: string | null;
  filter?: ProductFilter | null;
  orderBy?: ProductOrderBy | null;
}): Promise<{
  edges: { cursor: string; node: ProductRow }[];
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
}> {
  if (first <= 0) {
    return {
      edges: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: after != null,
      },
      totalCount: 0,
    };
  }

  // In a real data source this is where filter/order would be applied.
  const filtered = (() => {
    if (!filter?.category) return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === filter.category);
  })();

  const ordered = (() => {
    if (!orderBy) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (orderBy.field === 'PRICE') {
        comparison = a.price - b.price;
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      return orderBy.direction === 'ASC' ? comparison : -comparison;
    });
    return sorted;
  })();

  let startIndex = 0;
  if (after) {
    const payload = decodeProductCursor(after);
    // Ensure the cursor was generated using the same filter/order combination; otherwise pagination would break.
    if (
      JSON.stringify(payload.filter ?? null) !==
        JSON.stringify(filter ?? null) ||
      JSON.stringify(payload.orderBy ?? null) !==
        JSON.stringify(orderBy ?? null)
    ) {
      throw new Error('Cursor conditions do not match the current query.');
    }

    const afterId = payload.lastSeenId;
    const index = ordered.findIndex((product) => product.id === afterId);
    if (index < 0) {
      throw new Error('Cursor does not exist.');
    }
    startIndex = index + 1;
  }

  const slice = ordered.slice(startIndex, startIndex + first);
  const edges = slice.map((product) => ({
    cursor: makeProductCursor({ filter, orderBy, lastSeenId: product.id }),
    node: product,
  }));

  const lastEdge = edges.length > 0 ? edges[edges.length - 1] : undefined;
  const firstEdge = edges.length > 0 ? edges[0] : undefined;
  const hasNextPage = startIndex + slice.length < ordered.length;
  const hasPreviousPage = startIndex > 0;

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasNextPage,
      hasPreviousPage,
    },
    totalCount: ordered.length,
  };
}

/*
 * For datasets that do not need filter/order information (e.g. simple offset pagination or a single fixed sort),
 * you can keep using a bare cursor with just the `lastSeenId`. Embedding `filter` / `orderBy` is only necessary
 * when those parameters change the record ordering and must remain stable across cursor navigation; otherwise,
 * the extra metadata simply remains `null` as shown above.
 */
