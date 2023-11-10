/* eslint-disable import/no-extraneous-dependencies */
import { lastOfArray } from 'rxdb';

import { builder } from '../../builder';
import { db } from '../../db';

import { Hero, HeroPullBulkObjectType, CheckpointInputType } from './types';

builder.queryField('pullHero', (t) =>
  t.field({
    type: HeroPullBulkObjectType,
    authScopes: {
      isAuthenticated: true,
    },
    smartSubscription: true,
    subscribe: (subscriptions, root, args, ctx, info) => {
      subscriptions.register('streamHero');
    },
    args: {
      checkpoint: t.arg({
        type: CheckpointInputType,
        required: true,
      }),
      limit: t.arg({
        type: 'Int',
        required: true,
      }),
    },
    async resolve(_, args, ctx) {
      const minUpdatedAt = args.checkpoint.updatedAt
        ? new Date(args.checkpoint.updatedAt)
        : 0;

      const lastId = args.checkpoint.id ? args.checkpoint.id : '';
      const data = await db.hero.findMany({
        orderBy: [
          {
            updatedAt: 'asc',
          },
          {
            id: 'asc',
          },
        ],
        take: args.limit ?? 10,
        where: {
          updatedAt: {
            gt: new Date(minUpdatedAt),
          },
        },
      });

      const sortedDocuments: Hero[] = data.map((element) => {
        return {
          id: element.id,
          name: element.name,
          color: element.color,
          createdAt: element.createdAt,
          updatedAt: element.updatedAt,
          deleted: element.deleted,
        };
      });

      const limitedDocs = sortedDocuments.filter((doc) => {
        if (!args.checkpoint) {
          return true;
        }
        if (doc.updatedAt < minUpdatedAt) {
          return false;
        }
        if (doc.updatedAt > minUpdatedAt) {
          return true;
        }
        if (doc.updatedAt === minUpdatedAt) {
          if (doc.id > lastId) {
            return true;
          } else {
            return false;
          }
        }
      });

      const last = lastOfArray(limitedDocs);
      const ret = {
        documents: limitedDocs,
        checkpoint: last
          ? {
              id: last.id,
              updatedAt: last.updatedAt.getTime(),
            }
          : {
              id: lastId,
              updatedAt: minUpdatedAt !== 0 ? minUpdatedAt.getTime() : 0,
            },
      };
      return ret;
    },
  })
);
