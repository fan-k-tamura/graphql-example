import type {
  ResolversParentTypes,
  SubscriptionResolvers,
} from '../../../types.generated';
import { subscribeProductUpdated } from '../../../../subscriptions/event-bus';

export const productUpdated: NonNullable<
  SubscriptionResolvers['productUpdated']
> = {
  subscribe: (_parent, args) => {
    const iterator = subscribeProductUpdated();

    const stream = (async function* () {
      try {
        for await (const event of iterator) {
          if (event.productId === args.productId) {
            yield event.product;
          }
        }
      } finally {
        await iterator.return?.();
      }
    })();

    return stream;
  },
  resolve: (payload: ResolversParentTypes['Product']) => payload,
};

export default productUpdated;
