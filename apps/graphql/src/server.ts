/* eslint-disable turbo/no-undeclared-env-vars */
import { ServerResponse, createServer } from 'node:http';

import { PubSub } from 'graphql-subscriptions';
import { createYoga, useReadinessCheck } from 'graphql-yoga';

import { checkDbAvailable } from './db';
import { schema } from './schema';
import { User } from './types';
import 'dotenv/config';

export const pubsub = new PubSub();
async function getUserFromAuthHeader(authHeader: string): Promise<User | null> {
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    let currentUser: User | null = null;

    if (type !== 'Bearer') {
      return null;
    } else {
      if (token === 'fe65d9a5-e5b2-43d4-90e7-86b2425ed943') {
        currentUser = new User('1', 'juan@test.com', token);
      }
    }
    return currentUser;
  } else {
    console.error('No auth header found');
    return null;
  }
}

const yoga = createYoga({
  graphqlEndpoint: '/',
  healthCheckEndpoint: '/live',
  landingPage: false,
  schema,
  context: async ({ req }: ServerResponse) => ({
    currentUser: getUserFromAuthHeader(
      req.headers.authorization?.toString() ?? ''
    ),
    pubsub,
  }),
  plugins: [
    useReadinessCheck({
      endpoint: '/ready',
      check: async () => {
        const check = await checkDbAvailable();
        return check;
      },
    }),
  ],
});
const server = createServer(yoga);
const port = Number(process.env.PORT ?? 3001);

server.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`);
});
