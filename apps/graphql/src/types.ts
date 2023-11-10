import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';

export class User {
  userId: string;

  email: string;

  token: string;

  constructor(userId: string, email: string, token: string) {
    this.userId = userId;
    this.email = email;
    this.token = token;
  }
}

export interface ContextType {
  pubsub: PubSub;
  log: (info: GraphQLResolveInfo) => void;
  logSub: (action: string, name: string) => void;
}
