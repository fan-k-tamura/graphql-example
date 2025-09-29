# GraphQL ベストプラクティス実装例

このリポジトリは、GraphQLのベストプラクティスを実践的に学べる実装例。

## 特徴
- **レイヤー分離**: Resolverを薄く保ち、ビジネスロジックをDataLoader層に集約
- **パフォーマンス最適化**: N+1問題を回避し、効率的なデータフェッチを実現
- **型安全性**: GraphQL Code Generatorによる自動型生成で、型の整合性を保証
- **実用的なパターン**: ページネーション、Relay仕様、リアルタイムサブスクリプションなど、実務で必要な機能を網羅

Apollo Serverで実装しているが、アーキテクチャパターンは他のGraphQLサーバー（Yoga、Helixなど）にも応用可能。

## 1. クイックスタート

| コマンド | 説明 |
| --- | --- |
| `pnpm install` | 依存パッケージをインストール |
| `pnpm dev` | ホットリロードで起動 (http://localhost:4000/) |
| `pnpm start` | 1 度だけサーバー起動 |
| `pnpm codegen` | GraphQL Code Generator 実行 (`src/codegen.ts`) |
| `pnpm lint` | Biome で Lint |
| `pnpm format[:write]` | Biome で整形をプレビュー / 反映 |
| `pnpm ts-node scripts/check-queries.ts` | README のクエリを自動検証 |

- HTTP / WebSocket エンドポイント: `http://localhost:4000/graphql`

- 追加のクエリ例と補足: [docs/queries.md](docs/queries.md)


## 2. 実装パターン一覧

### データ取得パターン

#### 単一リソース取得
- **実装例**: `user(id)`, `product(id)`, `vendor(id)`
- **採用シーン**:
  - 詳細画面で特定のユーザー情報を表示
  - 商品ページで価格や在庫を参照
  - 編集フォームで既存データをロード
- **特徴**: シンプルで直感的、関連データもResolverで展開可能

#### 複数リソース取得
- **実装例**: `users(ids)`
- **採用シーン**:
  - カート内商品の出品者情報をまとめて取得
  - チャット参加者のプロフィールを一括表示
  - ダッシュボードで複数KPIを同時ロード
- **特徴**: DataLoaderによる自動最適化でN+1問題を回避

#### Relay Node Interface
- **実装例**: `node(id: ID!)`
- **採用シーン**:
  - URLのIDパラメータから直接リソースを復元
  - ポリモーフィックなコンテンツ（投稿/コメント/いいね）を統一的に扱う
  - クライアントキャッシュで型を意識せずデータ管理
- **特徴**: 統一的なインターフェースでキャッシュ管理が容易

### ページネーションパターン

| パターン | 実装例 | 採用シーン | メリット | デメリット |
| --- | --- | --- | --- | --- |
| **Offset方式** | `vendors(offset, limit)`, `orders(offset, limit)` | • 管理画面のテーブル表示<br>• CSV/Excel一括エクスポート<br>• ページ番号による遷移が必要なUI<br>• 検索結果の総件数表示が必須な場面 | SQLと1:1対応で実装が簡単 | 大量データで性能劣化、途中の削除で位置ずれ |
| **Cursor方式** | `products(first, after)`, `announcements(first, after)` | • SNSのタイムライン<br>• 商品一覧の無限スクロール<br>• リアルタイムで更新される通知リスト<br>• フィルタ条件が頻繁に変わる検索 | 位置が安定、フィルタ条件をカーソルに埋込可能 | 実装が複雑、任意ページへのジャンプが困難 |

### ミューテーションパターン

#### CRUD操作
- **作成**: `createProduct`
  - 採用シーン: 新商品登録、ユーザーアカウント作成、投稿公開
  - 特徴: 入力バリデーションとID自動生成を含む

- **更新**: `updateProduct`
  - 採用シーン: 価格変更、在庫調整、プロフィール編集
  - 特徴: パッチ方式で必要なフィールドのみ更新

- **削除**: `deleteProduct`
  - 採用シーン: 商品廃番、アカウント退会、コンテンツ削除
  - 特徴: 論理削除で履歴保持、関連データのカスケード処理

#### 複合更新
- **実装例**: `updateUserDetails`
- **採用シーン**:
  - 配送先と請求先を同時更新
  - ユーザー情報と権限設定をセットで変更
  - 注文ステータスと在庫を連動して更新
- **特徴**: トランザクション内で整合性保証、ロールバック対応

#### 状態遷移
- **実装例**: `updateOrderStatus`
- **採用シーン**:
  - 管理画面から注文のステータスを更新
  - デリバリーフローで PIT（packed → shipped → delivered）を進める
- **特徴**: ステータス変更を `orderStatusChanged` サブスクリプションにブロードキャスト

### サブスクリプション（リアルタイム更新）
- **実装例**: `productUpdated`, `orderStatusChanged`（クライアント例は [docs/subscription-client.md](docs/subscription-client.md)）
- **採用シーン**:
  - 在庫変動をリアルタイムで通知
  - チャットメッセージの即座配信
  - オークションの入札状況更新
  - 配送ステータスのトラッキング
- **特徴**: WebSocketを使用した双方向通信、イベントフィルタリング可能

> すべてのサンプルクエリは `scripts/check-queries.ts` で自動検証済み。詳細な実装例は [docs/queries.md](docs/queries.md) を参照。

## 3. フロントエンド実装のベストプラクティス

### スキーマファーストの設計思想
GraphQLの真価は、バックエンドで定義した単一のスキーマを、フロントエンドの多様な要件に合わせて活用することにある。

### Fragment戦略

#### 基本原則
- **1画面1Fragment**: 各画面・コンポーネントで必要なフィールドをFragmentで定義
- **段階的な詳細度**: 一覧用（最小）→ カード用（中間）→ 詳細用（最大）
- **共通化と再利用**: 複数画面で使うフィールドは共通Fragmentに切り出す

- 代表的な Fragment 構成は [docs/queries.md](docs/queries.md#クエリ設計ベストプラクティス) を参照。

### クエリ設計の指針

#### 共通原則
- OperationName は画面・ジョブ単位で付ける。
- 正規化キャッシュ前提で `id` を常に取得する。
- Apollo Client v3 では `addTypename` を切らない（独自クライアントは `__typename` を明示）。
- UI コンポーネントごとに Fragment を定義し、クエリ本体は Fragment Spread のみとする。

#### パターン別ルール

##### 単一リソース取得 (`user`, `product`)
- 参照 ID は必ず変数で受け取る。
- 詳細段階に応じて Fragment を積み上げる。
- 追加情報は `@include` 等で段階的にロードする。

##### Offset ページング (`vendors`, `orders`)
- `offset`/`limit` をリテラル埋め込みせず変数にする。
- `pageInfo` を返して前後ページ制御を UI に渡す。
- 同一フィールドを複数用途で使う場合はエイリアスで区別する。

##### Relay カーソルページング (`products`, `announcements`)
- `first`/`after`（または `last`/`before`）は変数化する。
- `pageInfo` と `edges.node { id __typename }` を必ず取得する。
- 並び替え・絞込条件は `orderBy`/`filter` に変数を渡す。

### スキーマ設計アンチパターン

- ⚠️ **用途ごとに `usersXxx` などのトップレベル Query フィールドを増やす**: フィルタ条件の違いでトップレベル（いわゆる root field）を追加し続けるとクライアントが断片化し、スキーマが肥大化する。
- 対応策: `users(filter:…, orderBy:…)` のように少数の正規化されたフィールドへ集約し、引数と DataLoader で最適化する。特別なビューが本当に必要な場合のみ新フィールドを追加する。
- 例外: データソースや権限境界が完全に別（例: 別マイクロサービス・監査ログ・パブリック公開データなど）なら新しい root field に切り出す。
- `bad`
  ```graphql
  type Query {
    usersByStatus(status: String!): [User!]!
    usersByRole(role: UserRole!): [User!]!
    usersByRegion(region: String!): [User!]!
  }
  ```
- `good`
  ```graphql
  type Query {
    users(filter: UserFilterInput, orderBy: UserOrderByInput, first: Int, after: String): UserConnection!
  }
  ```
- ⚠️ **異なるドメインロジックを 1 つの Mutation に押し込める**: `updateUserAndOrders` のように複数の関心ごとを同時に更新すると、ロールバックや並行更新の扱いが複雑になる。
- 対応策: ドメインの整合性が保てる粒度（DDD を採用している場合は集約単位）で Mutation を分割し、どうしてもまとめる場合はアプリケーション層でワークフローを調停する前提で設計する。
- `bad`
  ```graphql
  type Mutation {
    updateUserAndOrders(input: UpdateUserAndOrdersInput!): UpdateUserAndOrdersPayload!
  }
  ```
- `good`
  ```graphql
  type Mutation {
    updateUser(input: UpdateUserInput!): UpdateUserPayload!
    updateOrder(input: UpdateOrderInput!): UpdateOrderPayload!
  }
  ```
- ⚠️ **クライアントが 1 つのフォーム保存で複数 Mutation を連続送信**: `updateName`→`updateEmail`→`updateAddresses` のように細切れで呼ぶと、途中失敗時の整合性が取りづらく、ネットワーク往復も増える。
- 対応策: サーバー側にフォーム粒度の Mutation（例: `updateUserDetails`）を用意し、1 リクエストでまとめて送る。例外として、フィールドが完全に独立した UI（別タブ編集など）では分割した Mutation を許容する。
- `bad`
  ```graphql
  mutation UpdateName($input: UpdateUserNameInput!) { updateUserName(input: $input) { user { id name } } }
  mutation UpdateEmail($input: UpdateUserEmailInput!) { updateUserEmail(input: $input) { user { id email } } }
  mutation UpdateAddresses($input: UpdateUserAddressesInput!) { updateUserAddresses(input: $input) { user { id addresses { code address } } } }
  ```
- `good`
  ```graphql
  mutation UpdateUserDetails($input: UpdateUserDetailsInput!) {
    updateUserDetails(input: $input) {
      user {
        id
        name
        email
        addresses { code address tel }
      }
    }
  }
  ```

> これらはプロジェクトにおけるガードレール的な指針。例外が必要になった場合は、理由とスキーマへの影響を設計メモに残したうえで検討する前提とする。

> 代表的なベストプラクティスクエリや Fragment 構成は [docs/queries.md](docs/queries.md#クエリ設計ベストプラクティス) に集約している。SDL の実例は `src/gql/schema/<feature>/schema.graphql` を参照。

### パフォーマンス最適化

#### オーバーフェッチング防止
- **必要最小限のフィールド**: Fragmentで画面に必要なフィールドのみ取得
- **条件付き取得**: `@include` / `@skip` ディレクティブで動的制御
- **遅延読み込み**: 詳細データは別クエリで必要時に取得

#### キャッシュ戦略
- **正規化キャッシュ**: Apollo ClientやRelayでIDベースの自動キャッシュ
- **Fragment共有**: 同じFragmentを使う画面間でキャッシュ共有
- **楽観的更新**: ミューテーション後の即座のUI更新

### 型安全性の確保

- GraphQL Code Generator で Fragment ごとの型を生成し、UI コンポーネントに注入する。
- ジェネレート済み型を活用するとレスポンスの形が変わった際にコンパイルエラーで気付ける。

### 実装チェックリスト
- [ ] 画面ごとにFragmentを定義したか
- [ ] 共通フィールドを共通Fragmentに切り出したか
- [ ] オーバーフェッチングしていないか
- [ ] GraphQL Code Generatorで型を生成したか
- [ ] キャッシュ戦略を検討したか
- [ ] エラーハンドリングを実装したか

## 4. ディレクトリ構造

```
./
├── src/
│   ├── codegen.ts                # GraphQL Code Generator 設定
│   ├── codegen/plugins/
│   │   └── node-resolvers.js     # Relay Node 用カスタムプラグイン
│   ├── data/db/                  # 疑似 DB 層 (JOIN / ページング)
│   ├── gql/
│   │   ├── context.ts            # DataLoader を束ねた Context
│   │   └── schema/
│   │       ├── base/             # Relay Node / 共通 Query
│   │       ├── product/          # Product ドメイン + Loader + Resolvers
│   │       ├── user/             # User ドメイン + Loader + Resolvers
│   │       ├── ...               # 他ドメインも同様
│   │       └── *.generated.*     # Codegen の出力
│   └── server.ts                 # Apollo Server エントリポイント
├── scripts/
│   └── check-queries.ts          # README / docs のクエリを実行して検証
├── docs/
│   └── queries.md                # クエリ・ミューテーション・Fragment例集
├── package.json
├── tsconfig.json
└── biome.json
```

## 5. 代表的なクエリ
（そのほかの例は [docs/queries.md](docs/queries.md) を参照）

### 単一ユーザー
```graphql
query UserDetailExample {
  user(id: "user-1") {
    id
    name
    addresses { code address tel }
    profile { address tel }
  }
}
```
DataLoader が 1 度の `loadMany` で疑似 JOIN 結果を返す。

### Product の Cursor ページング
```graphql
query ProductCursorExample {
  products(first: 2) {
    totalCount
    pageInfo { endCursor hasNextPage }
    edges { cursor node { id name price } }
  }
}
```
Filter / Sort をカーソルに埋め込み、`after` だけで続きを取得できる。

### Relay Node から Product を復元
```graphql
query ProductNodeExample {
  node(id: "UHJvZHVjdDpwcm9kdWN0LWVzcHJlc3Nv") {
    __typename
    ... on Product { id name price description }
  }
}
```
Global ID を復号して型別 Resolver にフォールバックする流れを示す。

## 6. 推奨ワークフロー

1. SDL / Loader を編集 → `pnpm codegen` で型・集約を再生成
2. Resolver では DB ロジックを書かず、DataLoader 経由の結果を組み立てる
3. 新しいクエリ例は `scripts/check-queries.ts` の `cases` に追加
4. PR 前に `pnpm lint` と `pnpm format` で整形差分を確認

## 7. Apollo Server 以外で使うには

- `src/server.ts` を差し替えて別ランタイム (Yoga, Helix など) を起動する
- Resolver / Loader / Context / Codegen は共通なので、HTTP 層だけ差し替えればよい
- Playground を使わない場合でも `scripts/check-queries.ts` で回帰を確認できる
