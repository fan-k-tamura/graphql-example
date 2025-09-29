import type { QueryResolvers } from '../../../../types.generated';
import { resolveNode } from '../../../../nodeResolvers.generated';

// Relay の node(id: …) は Codegen 生成の resolveNode に委譲し、
// Global ID の decode → 各ドメインの取得処理を一箇所に集約する。
export const node: NonNullable<QueryResolvers['node']> = async (
  _parent,
  args,
  ctx,
) => {
  return resolveNode(args.id, ctx);
};

export default node;
