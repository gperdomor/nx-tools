import { generateFiles, joinPathFragments, ProjectConfiguration, stripIndents, Tree } from '@nrwl/devkit';
import { InitGeneratorSchema } from '../schema';

export function addPrismaConfig(
  tree: Tree,
  options: InitGeneratorSchema,
  project: ProjectConfiguration,
  prismaVersion: '3' | '4'
): void {
  if (tree.exists(joinPathFragments(project.root, 'prisma', 'schema.prisma'))) {
    throw new Error(
      stripIndents`The "schema.prisma" file already exists in the project "${options.project}". Are you sure this is the right project to set up Prisma?
      If you are sure, you can remove the existing file and re-run the generator.`
    );
  }

  // const filesDir = prismaVersion === '4' ? 'files/v4' : 'files/v3';
  const filesDir = 'files/v4';

  generateFiles(tree, joinPathFragments(__dirname, '..', filesDir), joinPathFragments(project.root, 'prisma'), {});
}
