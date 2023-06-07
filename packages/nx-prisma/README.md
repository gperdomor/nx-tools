# `@nx-tools/nx-prisma`

The Nx Plugin for Prisma contains executors, generators, and utilities for managing Prisma applications within an Nx workspace. It provides:

- Integration with [Prisma CLI](https://www.npmjs.com/package/prisma)
- Generators to help to setup your apps quickly

## Setting up the Prisma plugin

Adding the Prisma plugin to an existing Nx workspace can be done with the following:

```bash
npm install -D @nx-tools/nx-prisma
```

```bash
yarn add -D @nx-tools/nx-prisma
```

## Using the Prisma Plugin

### Configuring an application

It's straightforward to setup your application:

```bash
nx g @nx-tools/nx-prisma:init appName
```

By default, the application will be configured with:

- A Prisma schema in the application root.
- A set of targets and executors to invoke common prisma commands to manage your application. You can add more executors later.

We can then call generate, deploy, migrate, db pull, db push prisma commands, and even start prisma studio with the following commands:

```bash
nx prisma-generate appName
nx prisma-deploy appName
nx prisma-migrate appName
nx prisma-pull appName
nx prisma-push appName
nx prisma-studio appName
nx prisma-validate appName
```

> Tip: You can change the location or rename your prisma file, but should live inside the project folder and the `options.schema` property of your project target needs to be updated with the relative path to the new schema location.

## Package reference

Here is a list of all the executors and generators available from this package:

### Executors

- deploy: Apply pending migrations to update the database schema in production/staging.
- generate: Generate artifacts (e.g. Prisma Client).
- migrate: Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client).
- pull: Pull the schema from an existing database, updating the Prisma schema.
- push: Push the Prisma schema state to the database.
- reset: Reset your database and apply all migrations, all data will be lost.
- resolve: Resolve issues with database migrations in deployment databases.
- seed: Seed your database.
- status: Check the status of your database migrations.
- studio: Browse your data with Prisma Studio.
- validate: validate your Prisma schema.

### Generators

- init: Setup Prisma for your app
