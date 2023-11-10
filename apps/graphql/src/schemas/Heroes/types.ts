import { builder } from '../../builder';

export interface Hero {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

export interface Checkpoint {
  id: string;
  updatedAt: number;
}

export interface HeroPullBulk {
  documents: Hero[];
  checkpoint: Checkpoint;
}

export const HeroObjectType = builder
  .objectRef<Hero>('HeroObjectType')
  .implement({
    fields: (t) => ({
      id: t.exposeString('id', {
        nullable: false,
      }),
      name: t.exposeString('name', {
        nullable: false,
      }),
      color: t.exposeString('color', {
        nullable: false,
      }),
      createdAt: t.expose('createdAt', {
        type: 'DateTime',
        nullable: false,
      }),
      updatedAt: t.expose('updatedAt', {
        type: 'DateTime',
        nullable: false,
      }),
      deleted: t.exposeBoolean('deleted', {
        nullable: false,
      }),
    }),
  });

export const CheckpointInputType = builder
  .inputRef<Checkpoint>('CheckpointInputType')
  .implement({
    fields: (t) => ({
      id: t.field({
        type: 'String',
        required: true,
      }),
      updatedAt: t.field({
        type: 'Float',
        required: true,
      }),
    }),
  });

export const CheckpointObjectType = builder
  .objectRef<Checkpoint>('CheckpointObjectType')
  .implement({
    fields: (t) => ({
      id: t.exposeString('id', {
        nullable: false,
      }),
      updatedAt: t.exposeFloat('updatedAt', {
        nullable: false,
      }),
    }),
  });

export const HeroPullBulkObjectType = builder
  .objectRef<HeroPullBulk>('HeroPullBulkObjectType')
  .implement({
    subscribe: (subscriptions, poll, context) => {
      subscriptions.register('streamHero');
    },
    fields: (t) => ({
      documents: t.field({
        type: [HeroObjectType],
        resolve: (root) => root.documents,
      }),
      checkpoint: t.field({
        type: CheckpointObjectType,
        resolve: (root) => root.checkpoint,
      }),
    }),
  });

export const HeroInputType = builder.inputType('HeroInputType', {
  fields: (t) => ({
    id: t.field({
      type: 'String',
      required: true,
    }),
    name: t.field({
      type: 'String',
      required: true,
    }),
    color: t.field({
      type: 'String',
      required: true,
    }),
    createdAt: t.field({
      type: 'DateTime',
      required: true,
    }),
    updatedAt: t.field({
      type: 'DateTime',
      required: false,
    }),
    deleted: t.field({
      type: 'Boolean',
      required: false,
    }),
  }),
});

export const HeroInputPushRowInputType = builder.inputType(
  'HeroInputPushRowInputType',
  {
    fields: (t) => ({
      assumedMasterState: t.field({
        type: HeroInputType,
        required: false,
      }),
      newDocumentState: t.field({
        type: HeroInputType,
        required: false,
      }),
    }),
  }
);
