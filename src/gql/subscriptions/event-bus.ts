import { EventEmitter } from 'node:events';
import type { ResolversParentTypes } from '../schema/types.generated';

type ProductEvent = {
  productId: string;
  product: ResolversParentTypes['Product'];
};

type OrderStatusEvent = {
  orderId: string;
  order: ResolversParentTypes['Order'];
};

type Events = {
  PRODUCT_UPDATED: ProductEvent;
  ORDER_STATUS_CHANGED: OrderStatusEvent;
};

type EventName = keyof Events;

const emitter = new EventEmitter();
emitter.setMaxListeners(0);

function createAsyncIterator<E extends EventName>(
  eventName: E,
): AsyncIterableIterator<Events[E]> {
  const pullQueue: Array<(value: IteratorResult<Events[E]>) => void> = [];
  const pushQueue: Events[E][] = [];
  let listening = true;

  const handleEvent = (value: Events[E]) => {
    if (!listening) {
      return;
    }
    if (pullQueue.length > 0) {
      const resolve = pullQueue.shift();
      resolve?.({ value, done: false });
      return;
    }
    pushQueue.push(value);
  };

  const stop = () => {
    if (!listening) {
      return;
    }
    listening = false;
    emitter.off(eventName, handleEvent);
    while (pullQueue.length > 0) {
      const resolve = pullQueue.shift();
      resolve?.({ value: undefined as unknown as Events[E], done: true });
    }
    pushQueue.length = 0;
  };

  emitter.on(eventName, handleEvent);

  const iterator: AsyncIterableIterator<Events[E]> = {
    next() {
      if (!listening) {
        return Promise.resolve({
          value: undefined as unknown as Events[E],
          done: true,
        });
      }
      if (pushQueue.length > 0) {
        const value = pushQueue.shift() as Events[E];
        return Promise.resolve({ value, done: false });
      }
      return new Promise<IteratorResult<Events[E]>>((resolve) => {
        pullQueue.push(resolve);
      });
    },
    return() {
      stop();
      return Promise.resolve({
        value: undefined as unknown as Events[E],
        done: true,
      });
    },
    throw(error) {
      stop();
      return Promise.reject(error);
    },
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };

  return iterator;
}

export function publishProductUpdated(
  product: ResolversParentTypes['Product'],
): void {
  emitter.emit('PRODUCT_UPDATED', { productId: product.id, product });
}

export function subscribeProductUpdated(): AsyncIterableIterator<ProductEvent> {
  return createAsyncIterator('PRODUCT_UPDATED');
}

export function publishOrderStatusChanged(
  order: ResolversParentTypes['Order'],
): void {
  emitter.emit('ORDER_STATUS_CHANGED', { orderId: order.id, order });
}

export function subscribeOrderStatusChanged(): AsyncIterableIterator<OrderStatusEvent> {
  return createAsyncIterator('ORDER_STATUS_CHANGED');
}
