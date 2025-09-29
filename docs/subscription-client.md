# Subscription Client Examples

GraphQL サブスクリプションを利用する際のクライアント実装例。`ws://localhost:4000/graphql` を前提に `graphql-ws` とブラウザ fetcher の 2 パターンを示す。

## 1. Node.js + graphql-ws

```ts
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:4000/graphql',
});

async function main() {
  // Product 更新イベントを購読
  const productUpdated = client.iterate({
    query: /* GraphQL */ `
      subscription ProductUpdated($productId: ID!) {
        productUpdated(productId: $productId) {
          id
          name
          price
          description
        }
      }
    `,
    variables: { productId: 'product-espresso' },
  });

  // 更新結果をコンソールに流す
  for await (const result of productUpdated) {
    if (result.errors) {
      console.error(result.errors);
      continue;
    }
    console.log(result.data?.productUpdated);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## 2. ブラウザ (graphql-ws + fetcher)

```ts
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:4000/graphql',
});

export async function subscribeOrder(orderId: string, onMessage: (data: unknown) => void) {
  const dispose = client.subscribe(
    {
      query: /* GraphQL */ `
        subscription OrderStatus($orderId: ID!) {
          orderStatusChanged(orderId: $orderId) {
            id
            status
            total
          }
        }
      `,
      variables: { orderId },
    },
    {
      next: (result) => onMessage(result.data),
      error: (error) => console.error(error),
      complete: () => console.log('subscription completed'),
    },
  );

  return () => dispose();
}
```

> `graphql-ws` のブラウザ版は WebSocket を直接利用するため、Relay/Apollo Client を使用する場合はそれぞれのサブスクリプション Link 設定に読み替える。
