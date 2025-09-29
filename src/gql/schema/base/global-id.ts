import { Buffer } from 'node:buffer';
import type {
  ResolversInterfaceTypes,
  ResolversParentTypes,
} from '../types.generated';

// Relay の Global Object Identification に沿って、型名とローカル ID を連結する。
// Base64 で包むのは「不透明に見せる」ための慣習で、中身は人間が読める文字列。
const DELIMITER = ':';

type NodeUnion = ResolversInterfaceTypes<ResolversParentTypes>['Node'];
export type NodeTypeName = NodeUnion extends { __typename: infer T }
  ? Extract<T, string>
  : never;

// Relay 互換の Global ID。GraphQL 型名 + ローカル ID を Base64 でラップするだけのシンプルな仕組み。
export function toGlobalId(typeName: NodeTypeName, rawId: string): string {
  const payload = `${typeName}${DELIMITER}${rawId}`;
  return Buffer.from(payload, 'utf8').toString('base64');
}

// フロントから渡された Global ID を逆向きに読み解く。形式が崩れていたら null を返して Query.node 側で握りつぶす。
export function fromGlobalId(
  globalId: string,
): { typeName: string; rawId: string } | null {
  try {
    const decoded = Buffer.from(globalId, 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(DELIMITER);
    if (separatorIndex <= 0) {
      return null;
    }
    const typeName = decoded.slice(0, separatorIndex);
    const rawId = decoded.slice(separatorIndex + 1);
    if (!rawId) {
      return null;
    }
    return { typeName, rawId };
  } catch {
    return null;
  }
}
