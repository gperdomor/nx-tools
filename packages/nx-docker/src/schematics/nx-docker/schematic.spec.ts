import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxDockerSchematicSchema } from './schema';

describe('nx-docker schematic', () => {
  let appTree: Tree;
  const options: NxDockerSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner('@nx-tools/nx-docker', join(__dirname, '../../../collection.json'));

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(testRunner.runSchematicAsync('nx-docker', options, appTree).toPromise()).resolves.not.toThrowError();
  });
});
