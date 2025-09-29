import { ApolloServer } from '@apollo/server';
import { resolvers } from '../src/gql/schema/resolvers.generated';
import { typeDefs } from '../src/gql/schema/typeDefs.generated';
import { toGlobalId } from '../src/gql/schema/base/global-id';
import { createContext } from '../src/gql/context';

type QueryCase = {
  name: string;
  query: string;
  variables?: Record<string, unknown>;
};

// README に掲載しているクエリ例が壊れていないかを簡易検証する小さなスクリプト。
// Relay Node のサンプルは Global ID を生成してからクエリへ埋め込む。
const productNodeId = toGlobalId('Product', 'product-espresso');
// User は Relay Node に含めていないため、手動で Global ID を生成する。
const userNodeId = Buffer.from('User:user-1', 'utf8').toString('base64');

const cases: QueryCase[] = [
  {
    name: 'Relay node lookup',
    query: /* GraphQL */ `
      query {
        node(id: "${productNodeId}") {
          __typename
          ... on Product {
            id
            name
            price
            description
          }
        }
      }
    `,
  },
  {
    name: 'Create product mutation',
    query: /* GraphQL */ `
      mutation ($input: CreateProductInput!) {
        createProduct(input: $input) {
          clientMutationId
          product {
            id
            name
            price
            description
          }
        }
      }
    `,
    variables: {
      input: {
        clientMutationId: 'demo-mutation',
        name: 'Demo Product',
        price: 999,
        description: 'Sample mutation product',
      },
    },
  },
  {
    name: 'Update product mutation',
    query: /* GraphQL */ `
      mutation ($input: UpdateProductInput!) {
        updateProduct(input: $input) {
          clientMutationId
          product {
            id
            name
            price
            description
          }
        }
      }
    `,
    variables: {
      input: {
        clientMutationId: 'demo-update',
        id: productNodeId,
        patch: {
          price: 54000,
        },
      },
    },
  },
  {
    name: 'Delete product mutation',
    query: /* GraphQL */ `
      mutation ($input: DeleteProductInput!) {
        deleteProduct(input: $input) {
          clientMutationId
          deletedProductId
          product {
            id
            name
          }
        }
      }
    `,
    variables: {
      input: {
        clientMutationId: 'demo-delete',
        id: productNodeId,
      },
    },
  },
  {
    name: 'Update user details mutation',
    query: /* GraphQL */ `
      mutation ($input: UpdateUserDetailsInput!) {
        updateUserDetails(input: $input) {
          clientMutationId
          user {
            id
            name
            addresses { code address tel }
            profile { address tel }
          }
        }
      }
    `,
    variables: {
      input: {
        clientMutationId: 'demo-user-update',
        userId: userNodeId,
        userPatch: { name: 'Taro (updated)' },
        profilePatch: { address: 'Tokyo (updated)', tel: '03-9999-9999' },
        addresses: [
          { code: '101-0001', address: 'Chiba', tel: '043-000-0000' },
          { code: '101-0002', address: 'Kanagawa', tel: '045-000-0000' },
        ],
      },
    },
  },
  {
    name: 'Update order status mutation',
    query: /* GraphQL */ `
      mutation ($input: UpdateOrderStatusInput!) {
        updateOrderStatus(input: $input) {
          clientMutationId
          order {
            id
            status
            total
          }
        }
      }
    `,
    variables: {
      input: {
        clientMutationId: 'demo-order-status',
        id: 'order-003',
        status: 'SHIPPED',
      },
    },
  },
  {
    name: 'User detail fragment query',
    query: /* GraphQL */ `
      query ($id: ID!) {
        user(id: $id) {
          ...UserWithDetails
        }
      }

      fragment UserWithDetails on User {
        id
        name
        addresses { code address tel }
        profile { address tel }
      }
    `,
    variables: {
      id: 'user-1',
    },
  },
  {
    name: 'Single user user-1',
    query: /* GraphQL */ `
      query {
        user(id: "user-1") {
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
      }
    `,
  },
  {
    name: 'Single user user-2 without profile',
    query: /* GraphQL */ `
      query {
        user(id: "user-2") {
          id
          name
          addresses {
            code
            address
          }
          profile {
            address
            tel
          }
        }
      }
    `,
  },
  {
    name: 'Vendor detail',
    query: /* GraphQL */ `
      query {
        vendor(id: "vendor-espresso-supply") {
          id
          name
          category
          location
          contactEmail
          phone
        }
      }
    `,
  },
  {
    name: 'Product detail',
    query: /* GraphQL */ `
      query {
        product(id: "product-espresso") {
          id
          name
          price
          description
        }
      }
    `,
  },
  {
    name: 'Batch users in one request',
    query: /* GraphQL */ `
      query {
        first: user(id: "user-1") { id }
        second: user(id: "user-2") { id }
      }
    `,
  },
  {
    name: 'Users by ids',
    query: /* GraphQL */ `
      query {
        users(ids: ["user-1", "user-1", "user-2"]) {
          id
          name
        }
      }
    `,
  },
  {
    name: 'Vendors offset pagination',
    query: /* GraphQL */ `
      query {
        vendors(offset: 0, limit: 2) {
          totalCount
          pageInfo {
            offset
            limit
            hasNextPage
            hasPreviousPage
          }
          items {
            id
            name
            category
            location
            contactEmail
            phone
          }
        }
      }
    `,
  },
  {
    name: 'Orders export slice',
    query: /* GraphQL */ `
      query ExportOrders {
        orders(offset: 0, limit: 2) {
          totalCount
          pageInfo {
            offset
            limit
            hasNextPage
            hasPreviousPage
          }
          items {
            id
            status
            total
            user {
              id
              name
              addresses { address tel }
              profile { address tel }
            }
            items {
              id
              productId
              productName
              quantity
              unitPrice
              subtotal
            }
          }
        }
      }
    `,
  },
  {
    name: 'Products cursor pagination',
    query: /* GraphQL */ `
      query {
        products(first: 2) {
          totalCount
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              name
              price
              description
            }
          }
        }
      }
    `,
  },
  {
    name: 'Products with filter/order',
    query: /* GraphQL */ `
      query {
        products(
          first: 3
          filter: { category: "Goods" }
          orderBy: { field: PRICE, direction: DESC }
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
              name
              price
              description
            }
          }
        }
      }
    `,
  },
  {
    name: 'Announcements cursor pagination',
    query: /* GraphQL */ `
      query {
        announcements(first: 2) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              title
              publishedAt
            }
          }
        }
      }
    `,
  },
];

async function main(): Promise<void> {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  for (const testCase of cases) {
    const contextValue = await createContext();
    const result = await server.executeOperation(
      {
        query: testCase.query,
        variables: testCase.variables,
      },
      { contextValue },
    );

    if (result.body.kind !== 'single') {
      throw new Error(`Query "${testCase.name}" returned incremental result.`);
    }

    const { singleResult } = result.body;
    if (singleResult.errors && singleResult.errors.length > 0) {
      const messages = singleResult.errors
        .map((error) => error.message)
        .join(', ');
      throw new Error(`Query "${testCase.name}" failed: ${messages}`);
    }

    console.log(`✔ ${testCase.name}`);
  }

  await server.stop();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
