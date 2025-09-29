export type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
};

const ANNOUNCEMENTS: AnnouncementRow[] = [
  {
    id: 'announce-2024-05-new-roaster',
    title: 'New Roaster Arrived',
    content:
      'We have installed a new 15kg roaster to expand production capacity.',
    publishedAt: '2024-05-01T09:00:00Z',
  },
  {
    id: 'announce-2024-04-holiday-hours',
    title: 'Golden Week Hours',
    content:
      'During Golden Week, our flagship store will open from 10:00 to 18:00.',
    publishedAt: '2024-04-20T12:00:00Z',
  },
  {
    id: 'announce-2024-03-beans-update',
    title: 'New Single-Origin Beans',
    content:
      'We added Ethiopia Guji beans to the lineup. Available from next week.',
    publishedAt: '2024-03-15T08:30:00Z',
  },
  {
    id: 'announce-2024-02-app-release',
    title: 'Mobile App v2.0 Released',
    content:
      'The latest update introduces push notifications and wishlist features.',
    publishedAt: '2024-02-10T07:45:00Z',
  },
  {
    id: 'announce-2024-01-training',
    title: 'Barista Training Schedule',
    content: 'Monthly Latte Art training will be held every second Saturday.',
    publishedAt: '2024-01-05T10:15:00Z',
  },
];

const CURSOR_PREFIX = 'announcement:';

export async function findAnnouncementById(
  id: string,
): Promise<AnnouncementRow | null> {
  return ANNOUNCEMENTS.find((announcement) => announcement.id === id) ?? null;
}

export function encodeAnnouncementCursor(id: string): string {
  return Buffer.from(`${CURSOR_PREFIX}${id}`, 'utf-8').toString('base64');
}

export function decodeAnnouncementCursor(cursor: string): string {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  if (!decoded.startsWith(CURSOR_PREFIX)) {
    throw new Error('Invalid announcement cursor.');
  }
  return decoded.slice(CURSOR_PREFIX.length);
}

export async function paginateAnnouncements({
  first,
  after,
}: {
  first: number;
  after?: string | null;
}): Promise<{
  edges: { cursor: string; node: AnnouncementRow }[];
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
}> {
  const totalCount = ANNOUNCEMENTS.length;
  if (first <= 0) {
    return {
      edges: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: after != null,
      },
      totalCount,
    };
  }

  let startIndex = 0;
  if (after) {
    const afterId = decodeAnnouncementCursor(after);
    const index = ANNOUNCEMENTS.findIndex(
      (announcement) => announcement.id === afterId,
    );
    if (index < 0) {
      throw new Error('Cursor does not exist.');
    }
    startIndex = index + 1;
  }

  const slice = ANNOUNCEMENTS.slice(startIndex, startIndex + first);
  const edges = slice.map((announcement) => ({
    cursor: encodeAnnouncementCursor(announcement.id),
    node: announcement,
  }));

  const lastEdge = edges.length > 0 ? edges[edges.length - 1] : undefined;
  const firstEdge = edges.length > 0 ? edges[0] : undefined;
  const hasNextPage = startIndex + slice.length < totalCount;
  const hasPreviousPage = startIndex > 0;

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasNextPage,
      hasPreviousPage,
    },
    totalCount,
  };
}
