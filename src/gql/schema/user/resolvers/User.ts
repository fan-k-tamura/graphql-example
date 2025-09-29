import type { UserResolvers } from '../../types.generated';

// User は Relay Node 対応ではないので、特別な resolver は不要。既定のフィールド resolver に任せる。
export const User: UserResolvers = {};
