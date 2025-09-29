import { GraphQLError } from 'graphql';
import type { QueryResolvers } from '../../../types.generated';
import { normalizeAnnouncement } from '../../../nodeResolvers.generated';
import { paginateAnnouncements } from '../../../../../data/db/announcements';

// フィルタ・ソートなしのシンプルなカーソル例。Relay 互換の構造だけ押さえておき、
// Global ID などの共通処理は normalizeAnnouncement に委ねる。
export const announcements: NonNullable<
  QueryResolvers['announcements']
> = async (_parent, args) => {
  const first = Math.max(0, args.first);
  const result = await paginateAnnouncements({
    first,
    after: args.after ?? null,
  });
  return {
    ...result,
    // Cursor / Node の組み立てもここで統一。
    edges: result.edges.map((edge) => {
      const normalized = normalizeAnnouncement(edge.node);
      if (!normalized) {
        throw new GraphQLError('Failed to normalize announcement node.');
      }
      return { cursor: edge.cursor, node: normalized };
    }),
  };
};

export default announcements;
