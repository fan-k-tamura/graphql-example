# GraphQL クエリ・ミューテーション実装パターン集

このドキュメントでは、実際のアプリケーション開発で使用頻度の高いGraphQLパターンを体系的にまとめた。
すべてのサンプルは `pnpm ts-node scripts/check-queries.ts` で動作検証済み。

## 目次
- [ミューテーション（データ更新）](#ミューテーション)
- [クエリ（データ取得）](#クエリ)
- [Fragment（再利用可能な部分クエリ）](#付録-fragment-例)

## ミューテーション

### 1. Product を作成
**用途**: 新しい商品をデータベースに追加する際に使用
```graphql
mutation {
  createProduct(
    input: { clientMutationId: "demo-mutation", name: "Demo Product", price: 999, description: "Sample mutation product" }
  ) {
    clientMutationId
    product { id name price description }
  }
}
```

### 2. Product を更新
**用途**: 既存商品の価格や説明を部分的に更新（Global IDを使用）
```graphql
mutation {
  updateProduct(
    input: { clientMutationId: "demo-update", id: "UHJvZHVjdDpwcm9kdWN0LWVzcHJlc3Nv", patch: { price: 54000 } }
  ) {
    clientMutationId
    product { id name price }
  }
}
```

### 3. Product を削除
**用途**: 商品を論理削除し、削除された商品情報を返却
```graphql
mutation {
  deleteProduct(
    input: { clientMutationId: "demo-delete", id: "UHJvZHVjdDpwcm9kdWN0LWVzcHJlc3Nv" }
  ) { clientMutationId deletedProductId product { id name } }
}
```

### 4. User/Address/Profile をまとめて更新
**用途**: ユーザー情報と関連データをトランザクション内で一括更新
```graphql
mutation {
  updateUserDetails(
    input: {
      clientMutationId: "demo-user-update"
      userId: "user-1"
      userPatch: { name: "Taro (updated)" }
      profilePatch: { address: "Tokyo (updated)", tel: "03-9999-9999" }
      addresses: [
        { code: "101-0001", address: "Chiba", tel: "043-000-0000" }
        { code: "101-0002", address: "Kanagawa", tel: "045-000-0000" }
      ]
    }
  ) {
    clientMutationId
    user { id name addresses { code address tel } profile { address tel } }
  }
}
```

### 5. Order のステータスを更新
**用途**: 管理画面などから注文の状態を進める
```graphql
mutation UpdateOrderStatusExample($input: UpdateOrderStatusInput!) {
  updateOrderStatus(input: $input) {
    clientMutationId
    order {
      id
      status
      total
    }
  }
}

# Variables
{
  "input": {
    "clientMutationId": "demo-order-status",
    "id": "order-003",
    "status": "SHIPPED"
  }
}
```

## クエリ

### 1. Filter/Order 付き Product カーソルページネーション
**用途**: 商品一覧を条件で絞り込み、価格順などで並び替えて取得
```graphql
query ProductsByFilter {
  products(
    first: 3
    filter: { category: "Goods" }
    orderBy: { field: PRICE, direction: DESC }
  ) {
    totalCount
    pageInfo { endCursor hasNextPage }
    edges { cursor node { id name price description } }
  }
}
```

### 2. Announcements のシンプルなカーソルページネーション
**用途**: お知らせ一覧を新着順に無限スクロールで表示
```graphql
query AnnouncementsLatest {
  announcements(first: 2) {
    totalCount
    pageInfo { endCursor hasNextPage }
    edges { cursor node { id title publishedAt } }
  }
}
```

### 3. Vendors の Offsetページネーション
**用途**: ベンダー一覧を従来型のページ番号で管理（管理画面向け）
```graphql
query VendorsPage {
  vendors(offset: 0, limit: 2) {
    totalCount
    pageInfo { offset limit hasNextPage hasPreviousPage }
    items { id name category location contactEmail phone }
  }
}
```

### 4. Orders のバッチ取得（CSV エクスポート向け）
**用途**: 注文データを固定範囲で取得し、CSVやExcelにエクスポート
```graphql
query ExportOrders {
  orders(offset: 0, limit: 2) {
    totalCount
    pageInfo { offset limit hasNextPage hasPreviousPage }
    items {
      id status total
      user { id name addresses { address tel } profile { address tel } }
      items { id productId productName quantity unitPrice subtotal }
    }
  }
}
```

### 5. 単一リソースの詳細取得
**用途**: IDを指定して特定のベンダーや商品の詳細情報を取得
```graphql
query VendorDetailExample {
  vendor(id: "vendor-espresso-supply") {
    id
    name
    category
    location
    contactEmail
    phone
  }
}

query ProductDetailExample {
  product(id: "product-espresso") {
    id
    name
    price
    description
  }
}
```

### 6. 複数ユーザーのバッチ取得
**用途**: 複数のユーザーIDを一度に指定して効率的にデータ取得（DataLoaderによる最適化）
```graphql
query UsersBatchExample {
  users(ids: ["user-1", "user-1", "user-2"]) {
    id
    name
  }
}
```

## サブスクリプション

### 1. Product 更新イベント
**用途**: 特定商品の価格や説明が更新されたことを UI に反映
```graphql
subscription ProductUpdatedExample($productId: ID!) {
  productUpdated(productId: $productId) {
    id
    name
    price
    description
  }
}

# Variables
{
  "productId": "product-espresso"
}
```

### 2. Order ステータス変更イベント
**用途**: 注文の配送ステータスが変わったタイミングでダッシュボードを更新
```graphql
subscription OrderStatusChangedExample($orderId: ID!) {
  orderStatusChanged(orderId: $orderId) {
    id
    status
    total
    user {
      id
      name
    }
  }
}

# Variables
{
  "orderId": "order-003"
}
```

> サブスクリプションの接続には GraphQL over WebSocket (`ws://localhost:4000/graphql`) を使用する。具体的なクライアント実装例は [docs/subscription-client.md](subscription-client.md) を参照。

## Fragment パターン

### Fragmentとは？
GraphQLのFragmentは、クエリの一部を再利用可能な単位として定義する機能。

**メリット**:
- コンポーネントごとに必要なフィールドを定義できる
- クエリの重複を削減し、メンテナンス性が向上
- UIの変更に柔軟に対応可能
- GraphQL Code Generatorと組み合わせることで、TypeScriptの型を自動生成可能

### Fragment実装例

画面やコンポーネントごとに必要なフィールドを定義する実践的な例：

```graphql
# 1. コンパクト表示用（ユーザー一覧など）
fragment UserCompact on User {
  id
  name
}

# 2. 住所付き表示用（配送先選択画面など）
fragment UserWithAddresses on User {
  id
  name
  addresses {
    code
    address
  }
}

# 3. 詳細表示用（プロフィール画面など）
fragment UserWithDetails on User {
  id
  name
  addresses {
    code
    address
    tel
  }
  profile {
    address
    tel
  }
}
```

### Fragmentの使用例

```graphql
# Fragmentを使ったクエリ
query GetUserDetails($id: ID!) {
  user(id: $id) {
    ...UserWithDetails
  }
}

# 複数のFragmentを組み合わせる
query GetUsersForList($ids: [ID!]!, $detailId: ID!) {
  users(ids: $ids) {
    ...UserCompact
  }
  user(id: $detailId) {
    ...UserWithDetails
  }
}
```

これらのFragmentをGraphQL Code Generatorと組み合わせることで、画面専用のTypeScript型が自動生成され、型安全な開発が可能になる。

## クエリ設計ベストプラクティス

ユースケースに応じて OperationName と Fragment を組み合わせる例。各クエリは `scripts/check-queries.ts` の `cases` に追加して検証すると安全。
- Relay Connection 型のページングでは `first`/`after` や `last`/`before`、offset ページングでは `offset`/`limit` を使い、いずれも変数で受け取るとキャッシュキーを安定させられる。
- README の「クエリ設計の指針」で触れている 3 区分（単一リソース、offset ページング、Relay カーソル）の実装がここに対応している。

### Fragment構成
```graphql
# 一覧向けの最小フィールド
fragment UserListItem on User {
  id
  __typename
  name
}

# カード表示用に住所の概要を付与
fragment AddressPreview on Address {
  code
  address
}

fragment UserCard on User {
  ...UserListItem
  addresses {
    ...AddressPreview
  }
}

# 詳細表示でプロフィールまで展開
fragment AddressDetail on Address {
  code
  address
  tel
}

fragment UserDetail on User {
  ...UserCard
  addresses {
    ...AddressDetail
  }
  profile {
    address
    tel
  }
}
```

### クエリ例

#### 一覧用: 指定ユーザーだけを取得
```graphql
query UserListPage($ids: [ID!]!) {
  users(ids: $ids) {
    ...UserListItem
  }
}
```

#### 詳細画面: 条件付きでプロフィールを展開
```graphql
query UserDetailPage($userId: ID!, $includeProfile: Boolean! = false) {
  user(id: $userId) {
    ...UserCard
    profile @include(if: $includeProfile) {
      address
      tel
    }
  }
}
```

#### カタログ: Relay Connection で絞込 + ソート
```graphql
query ProductCatalogPage(
  $first: Int! = 12
  $after: String
  $category: String
  $direction: SortDirection! = DESC
) {
  products(
    first: $first
    after: $after
    filter: { category: $category }
    orderBy: { field: PRICE, direction: $direction }
  ) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        __typename
        name
        price
        description
      }
    }
  }
}
```

#### 管理ダッシュボード: 複数リストを一度に取得
```graphql
query BackOfficeDashboard(
  $vendorOffset: Int! = 0
  $vendorLimit: Int! = 5
  $orderOffset: Int! = 0
  $orderLimit: Int! = 3
) {
  vendorList: vendors(offset: $vendorOffset, limit: $vendorLimit) {
    totalCount
    pageInfo {
      offset
      limit
      hasNextPage
    }
    items {
      id
      name
      category
      location
    }
  }
  recentOrders: orders(offset: $orderOffset, limit: $orderLimit) {
    totalCount
    pageInfo {
      offset
      limit
      hasNextPage
    }
    items {
      id
      status
      total
      user {
        ...UserListItem
      }
    }
  }
}
```

#### TypeScriptでの型利用
```typescript
type UserListItemFragment = {
  __typename: "User";
  id: string;
  name: string;
};

const UserListItem: React.FC<{ user: UserListItemFragment }> = ({ user }) => (
  <li>{user.name}</li>
);
```
