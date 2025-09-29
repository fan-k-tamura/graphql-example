import type { AnnouncementResolvers } from '../../types.generated';
import { toGlobalId } from '../../base/global-id';

// Relay Node 資格を持つ型は、通常のクエリでも Global ID を返しておくと
// フロントキャッシュが node() で取得したデータと突き合わせられる。
// 実際のノード登録は nodeResolvers.generated.ts が担うため、ここでは ID の正規化だけ行う。
export const Announcement: AnnouncementResolvers = {
  id: (parent) => toGlobalId('Announcement', parent.id),
};
