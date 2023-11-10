import { builder } from '../../builder';
import { db } from '../../db';

import { HeroObjectType, HeroInputPushRowInputType, Hero } from './types';

builder.mutationField('pushHero', (t) =>
  t.field({
    type: [HeroObjectType],
    authScopes: {
      isAuthenticated: true,
    },
    args: {
      heroPushRow: t.arg({
        type: [HeroInputPushRowInputType],
        required: true,
      }),
    },
    resolve: async (_, args, ctx) => {
      const rows = args.heroPushRow;
      const lastCheckpoint = {
        id: '',
        updatedAt: 0,
      };
      const conflicts: Hero[] = [];
      const writtenDocs: Hero[] = [];

      rows.every(async (row) => {
        const docId = row.newDocumentState?.id;
        const data = await db.hero.findUnique({
          where: {
            id: docId,
          },
        });

        const docCurrentMaster: Hero = {
          id: data?.id ? data?.id : '',
          name: data?.name ? data?.name : '',
          color: data?.color ? data?.color : '',
          createdAt: data?.createdAt ? data?.createdAt : new Date(),
          updatedAt: data?.updatedAt ? data?.updatedAt : new Date(),
          deleted: data?.deleted ? data?.deleted : false,
        };

        /**
         * Detect conflicts.
         */
        // if (
        //   docCurrentMaster &&
        //   row.assumedMasterState &&
        //   docCurrentMaster.updatedAt !== row.assumedMasterState.updatedAt
        // ) {
        //   conflicts.push(docCurrentMaster);
        //   return false;
        // }

        const doc: Hero = {
          id: row.newDocumentState?.id ? row.newDocumentState?.id : '',
          name: row.newDocumentState?.name ? row.newDocumentState?.name : '',
          color: row.newDocumentState?.color ? row.newDocumentState?.color : '',
          createdAt: row.newDocumentState?.createdAt
            ? row.newDocumentState?.createdAt
            : new Date(),
          updatedAt: row.newDocumentState?.updatedAt
            ? row.newDocumentState?.updatedAt
            : new Date(),
          deleted: row.newDocumentState?.deleted
            ? row.newDocumentState?.deleted
            : false,
        };

        await db.hero.upsert({
          where: {
            id: doc?.id,
          },
          update: {
            name: doc?.name,
            color: doc?.color,
            updatedAt: doc?.updatedAt ? doc?.updatedAt : new Date(),
            deleted: doc?.deleted ? doc?.deleted : false,
          },
          create: {
            id: doc?.id,
            name: doc?.name ? doc?.name : '',
            color: doc?.color ? doc?.color : '',
            createdAt: doc?.createdAt,
            updatedAt: doc?.updatedAt ? doc?.updatedAt : new Date(),
            deleted: false,
          },
        });
        lastCheckpoint.id = doc?.id ? doc?.id : '';
        lastCheckpoint.updatedAt = doc?.updatedAt
          ? doc?.updatedAt.getTime()
          : new Date().getTime();
        writtenDocs.push(doc);
        return true;
      });

      ctx.pubsub.publish('streamHero', {
        streamHero: {
          documents: writtenDocs,
          checkpoint: lastCheckpoint,
        },
      });
      return conflicts;
    },
  })
);
