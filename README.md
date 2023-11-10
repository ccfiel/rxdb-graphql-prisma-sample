# RxDB Example code using GraphQL

This project is a sample implementation demonstrating the integration of RxDB, a real-time, offline-first database, with GraphQL and Prisma. It provides a practical example of how these technologies can be used together to build robust, scalable applications.

## Using this example

Run the following command:

```command
git clone https://github.com/ccfiel/rxdb-graphql-prisma-sample.git

cd rxdb-graphql-prisma-sample

pnpm install

cd apps/graphql

pnpm generate

pnpm createdb

pnpm seed

cd ../..

pnpm dev

```
## URL and Server ports?

Server http://localhost:3001
Client http://localhost:5174


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: app
- `web`: rxdb svelte client app
- `graphql`: rxdb graphql server app
- `ui`: a stub Svelte component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-plugin-svelte` and `eslint-config-prettier`)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities and framework used.

This Turborepo has some additional tools already setup for you:

- `prisma`: Next-generation Node.js and TypeScript ORM [prisma](https://www.prisma.io/)
- `graphql-yoga`: The fully-featured GraphQL Server with focus on easy setup, performance and great developer experience. [graphql-yoga](https://the-guild.dev/graphql/yoga-server)
- `pothos`: The most type-safe way to build GraphQL schemas in typescript [pothos](https://pothos-graphql.dev/)
- `sqlite`: SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. [sqlite](https://www.sqlite.org/index.html)
- `prisma`: Next-generation Node.js and TypeScript ORM [prisma](https://www.prisma.io/)
- `sveltekit`: a [svelte-kit](https://kit.svelte.dev/) app
- `turborepo`: is an incremental bundler and build system optimized for JavaScript and TypeScript, written in Rust. [turborepo](https://turbo.build/)
