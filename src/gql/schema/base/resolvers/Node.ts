import type { NodeResolvers } from '../../types.generated';

export const Node: NodeResolvers = {
  __resolveType(obj) {
    if (obj == null) {
      return null;
    }

    // レジストリが __typename を付けたオブジェクトだけを返すので、ここではその値を信用して良い。
    if (
      typeof obj === 'object' &&
      '__typename' in obj &&
      typeof obj.__typename === 'string'
    ) {
      return obj.__typename;
    }

    return null;
  },
};

export default Node;
