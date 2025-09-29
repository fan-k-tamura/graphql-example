import { GraphQLError } from 'graphql';
import type { OrderLineResolvers } from '../../types.generated';

export const OrderLine: OrderLineResolvers = {
  product: async (parent, _args, ctx) => {
    const product = await ctx.loaders.productById.load(parent.productId);
    if (!product) {
      throw new GraphQLError(`Product ${parent.productId} not found.`);
    }
    return product;
  },
};

export default OrderLine;
