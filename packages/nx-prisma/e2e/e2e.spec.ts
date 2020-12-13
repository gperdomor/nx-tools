// import { Architect, BuilderRun } from '@angular-devkit/architect';
// import { TestingArchitectHost } from '@angular-devkit/architect/testing';
// import { schema } from '@angular-devkit/core';
// import { exists } from 'fs';
// import { join } from 'path';
// import { PrismaGenerateSchema, PrismaMigrateSchema, PrismaRollbackSchema, PrismaSeedSchema } from '../src';

// const options: PrismaGenerateSchema & PrismaMigrateSchema & PrismaRollbackSchema & PrismaSeedSchema = {
//   schema: join(__dirname, 'schema.prisma'),
//   script: join(__dirname, 'seed.ts'),
//   tsConfig: join(__dirname, '../tsconfig.spec.json'),
//   silent: true,
// };

describe('Prisma Builders', () => {
  test.todo('add tests');

  // let architect: Architect;
  // let architectHost: TestingArchitectHost;
  // beforeAll(async () => {
  //   const registry = new schema.CoreSchemaRegistry();
  //   registry.addPostTransform(schema.transforms.addUndefinedDefaults);
  //   architectHost = new TestingArchitectHost('/root', '/root');
  //   architect = new Architect(architectHost, registry);
  //   await architectHost.addBuilderFromPackage(join(__dirname, '..'));
  // });
  // describe('generate', () => {
  //   let run: BuilderRun;
  //   beforeAll(async () => {
  //     run = await architect.scheduleBuilder('@nx-tools/nx-prisma:generate', options);
  //   });
  //   it('can run', async () => {
  //     const output = await run.result;
  //     await run.stop();
  //     expect(output.success).toBe(true);
  //   });
  //   it('generates client', async () => {
  //     await run.stop();
  //     exists(join(__dirname, 'artifacts/client'), (clientExists) => expect(clientExists).toBe(true));
  //   });
  // });
  // describe('migrations', () => {
  //   let run: BuilderRun;
  //   beforeAll(async () => {
  //     run = await architect.scheduleBuilder('@nx-tools/nx-prisma:migrations', options);
  //   });
  //   it('can run', async () => {
  //     const output = await run.result;
  //     await run.stop();
  //     expect(output.success).toBe(true);
  //   });
  // });
  // describe('seed', () => {
  //   let run: BuilderRun;
  //   beforeAll(async () => {
  //     const migrations = await architect.scheduleBuilder('@nx-tools/nx-prisma:migrations', options);
  //     await migrations.stop();
  //     run = await architect.scheduleBuilder('@nx-tools/nx-prisma:seed', options);
  //   });
  //   it('can run', async () => {
  //     const output = await run.result;
  //     await run.stop();
  //     expect(output.success).toBe(true);
  //   });
  // });
  // describe('rollback', () => {
  //   let run: BuilderRun;
  //   beforeAll(async () => {
  //     run = await architect.scheduleBuilder('@nx-tools/nx-prisma:rollback', options);
  //   });
  //   it('can run', async () => {
  //     const output = await run.result;
  //     await run.stop();
  //     expect(output.success).toBe(true);
  //   });
  // });
});
