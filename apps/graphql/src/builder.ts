import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import RelayPlugin from '@pothos/plugin-relay';
import SmartSubscriptionsPlugin, {
  subscribeOptionsFromIterator,
} from '@pothos/plugin-smart-subscriptions';
import { DateTimeResolver } from 'graphql-scalars';
import { PubSub } from 'graphql-subscriptions';

import type PrismaTypes from '../prisma/generated';

import { db } from './db';
import { User, ContextType } from './types';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: {
    pubsub: PubSub;
    currentUser: User;
    contextType: ContextType;
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  AuthScopes: {
    isAuthenticated: boolean;
  };
}>({
  plugins: [
    PrismaPlugin,
    RelayPlugin,
    SimpleObjectsPlugin,
    ScopeAuthPlugin,
    PrismaUtils,
    SmartSubscriptionsPlugin,
  ],
  prisma: {
    client: db,
  },
  relayOptions: {},
  authScopes: async (context): Promise<{ isAuthenticated: boolean }> => ({
    isAuthenticated: (await context.currentUser) !== null,
  }),
  smartSubscriptions: {
    ...subscribeOptionsFromIterator((name, { pubsub }) => {
      return pubsub.asyncIterator(name);
    }),
  },
});

builder.queryType();
builder.mutationType();
builder.subscriptionType();
builder.addScalarType('DateTime', DateTimeResolver, {});
