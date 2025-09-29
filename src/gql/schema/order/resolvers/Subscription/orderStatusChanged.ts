import type {
  ResolversParentTypes,
  SubscriptionResolvers,
} from '../../../types.generated';
import { subscribeOrderStatusChanged } from '../../../../subscriptions/event-bus';

export const orderStatusChanged: NonNullable<
  SubscriptionResolvers['orderStatusChanged']
> = {
  subscribe: (_parent, args) => {
    const iterator = subscribeOrderStatusChanged();

    const stream = (async function* () {
      try {
        for await (const event of iterator) {
          if (event.orderId === args.orderId) {
            yield event.order;
          }
        }
      } finally {
        await iterator.return?.();
      }
    })();

    return stream;
  },
  resolve: (payload: ResolversParentTypes['Order']) => payload,
};

export default orderStatusChanged;
