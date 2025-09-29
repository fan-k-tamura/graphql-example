import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { resolvers } from './gql/schema/resolvers.generated';
import { typeDefs } from './gql/schema/typeDefs.generated';
import { createContext } from './gql/context';

async function main(): Promise<void> {
  // HTTP サーバー + Express をベースにし、HTTP と WebSocket を同じポートで提供する。
  const app = express();
  const httpServer = createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async () => createContext(),
    }),
  );

  // graphql-ws で WebSocket サブスクリプションを配線。
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  useServer(
    {
      schema: server.schema,
      context: async () => createContext(),
    },
    wsServer,
  );

  const port = Number(process.env.PORT ?? 4000);
  httpServer.listen(port, () => {
    console.log(`🚀 HTTP/WS server ready at http://localhost:${port}/graphql`);
  });
}

void main();
