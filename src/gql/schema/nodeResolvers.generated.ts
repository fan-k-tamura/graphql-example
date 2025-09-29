/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Context } from '../context'
import type { ResolversInterfaceTypes, ResolversParentTypes } from './types.generated'
import { fromGlobalId } from './base/global-id'
import { findProductById } from '../../data/db/products'
import { findAnnouncementById } from '../../data/db/announcements'

type NodeUnion = ResolversInterfaceTypes<ResolversParentTypes>['Node']

// Product 用: 取得したデータを resolver が扱いやすいようコピーする補助関数。
export function normalizeProduct(record: ResolversParentTypes['Product'] | null | undefined): ResolversParentTypes['Product'] | null {
  if (!record) return null
  return { ...record } as ResolversParentTypes['Product']
}

// Announcement 用: 取得したデータを resolver が扱いやすいようコピーする補助関数。
export function normalizeAnnouncement(record: ResolversParentTypes['Announcement'] | null | undefined): ResolversParentTypes['Announcement'] | null {
  if (!record) return null
  return { ...record } as ResolversParentTypes['Announcement']
}

export async function resolveNode(globalId: string, context: Context): Promise<NodeUnion | null> {
  const decoded = fromGlobalId(globalId)
  if (decoded == null) {
    return null
  }
  // Global ID に含まれる型名ごとに取得処理を振り分ける。
  switch (decoded.typeName) {
    // DB ヘルパーを直接呼んで単一レコードを取得し、GraphQL resolver が扱いやすい形に整える
    case 'Product': {
      const record = await findProductById(decoded.rawId)
      const normalized = normalizeProduct(record)
      return normalized ? { __typename: 'Product' as const, ...normalized } : null
    }
    // DB ヘルパーを直接呼んで単一レコードを取得し、GraphQL resolver が扱いやすい形に整える
    case 'Announcement': {
      const record = await findAnnouncementById(decoded.rawId)
      const normalized = normalizeAnnouncement(record)
      return normalized ? { __typename: 'Announcement' as const, ...normalized } : null
    }
    default:
      return null
  }
}
