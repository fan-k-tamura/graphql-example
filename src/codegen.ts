import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files';
import type { CodegenConfig } from '@graphql-codegen/cli';

// GraphQL Code Generator の単一設定ファイル。
// - gql/schema 配下に resolver/型ファイルを出力
// - nodeResolvers.generated.ts で Relay Node 用の補助コードを生成

const config: CodegenConfig = {
  schema: 'src/gql/schema/**/*.graphql',
  generates: {
    'src/gql/schema': defineConfig({
      typesPluginsConfig: {
        // GraphQL Resolver の土台となる型の生成設定。
        // contextType には Apollo Server の request context を指定し、
        // mappers で DB レイヤーの型と GraphQL 型を関連付ける。
        contextType: '../context#Context',
        mappers: {
          Vendor: '../../data/db/vendors#VendorRow',
          User: '../../data/db/users#UserWithRelations',
          Product: '../../data/db/products#ProductRow',
          Order: '../../data/db/orders#OrderWithRelations',
          OrderLine: '../../data/db/orders#OrderLineWithSubtotal',
          Announcement: '../../data/db/announcements#AnnouncementRow',
        },
        enumsAsTypes: true,
        useTypeImports: true,
        avoidOptionals: {
          field: true,
        },
        defaultMapper: 'Partial<{T}>',
      },
    }),
    'src/gql/schema/nodeResolvers.generated.ts': {
      // Relay Node 対応の定型処理をカスタムプラグインで生成。
      // グローバル ID の decode → 各ドメインの取得 → __typename 付与 を 1 箇所に閉じ込める。
      plugins: [
        {
          './src/codegen/plugins/node-resolvers.js': {
            entries: [
              {
                typeName: 'Product',
                loader: {
                  // Product は単純な DB ユーティリティで取得
                  importFrom: '../../data/db/products',
                  namedImport: 'findProductById',
                },
              },
              {
                typeName: 'Announcement',
                loader: {
                  // Announcement も DataLoader を介さず直接取得
                  importFrom: '../../data/db/announcements',
                  namedImport: 'findAnnouncementById',
                },
              },
            ],
          },
        },
      ],
    },
  },
  documents: [],
  overwrite: true,
};

export default config;
