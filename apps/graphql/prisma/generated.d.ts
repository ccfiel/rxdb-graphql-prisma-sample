/* eslint-disable */
import type { Prisma, Hero } from "/Users/chrisianfiel/rxdb-sample/node_modules/.pnpm/@prisma+client@5.5.2_prisma@5.5.2/node_modules/@prisma/client";
export default interface PrismaTypes {
    Hero: {
        Name: "Hero";
        Shape: Hero;
        Include: never;
        Select: Prisma.HeroSelect;
        OrderBy: Prisma.HeroOrderByWithRelationInput;
        WhereUnique: Prisma.HeroWhereUniqueInput;
        Where: Prisma.HeroWhereInput;
        Create: Prisma.HeroCreateInput;
        Update: Prisma.HeroUpdateInput;
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
}