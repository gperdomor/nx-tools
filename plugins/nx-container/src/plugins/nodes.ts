import {
  CreateDependencies,
  CreateNodes,
  detectPackageManager,
  parseJson,
  readJsonFile,
  TargetConfiguration,
  writeJsonFile,
} from '@nx/devkit';
import { calculateHashForCreateNodes } from '@nx/devkit/src/utils/calculate-hash-for-create-nodes';
import { getLockFileName } from '@nx/js';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { workspaceDataDirectory } from 'nx/src/utils/cache-directory';
import { dirname, join } from 'path';
import { DEFAULT_ENGINE, DEFAULT_REGISTRY } from '../generators/configuration/constants';

export interface ContainerPluginOptions {
  buildTargetName?: string;
  defaultEngine?: string;
  defaultRegistry?: string;
}

const cachePath = join(workspaceDataDirectory, 'container.hash');
const targetsCache = readTargetsCache();

function readTargetsCache(): Record<string, Record<string, TargetConfiguration<ContainerPluginOptions>>> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache() {
  writeJsonFile(cachePath, targetsCache);
}

export const createDependencies: CreateDependencies = () => {
  writeTargetsToCache();
  return [];
};

export const createNodes: CreateNodes<ContainerPluginOptions> = [
  '**/Dockerfile',
  async (configFilePath, options, context) => {
    options = normalizeOptions(options);
    const projectRoot = dirname(configFilePath);

    // Do not create a project if package.json and project.json isn't there.
    const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
    if (!siblingFiles.includes('package.json') && !siblingFiles.includes('project.json')) {
      return {};
    }

    const hash = await calculateHashForCreateNodes(projectRoot, options, context, [
      getLockFileName(detectPackageManager(context.workspaceRoot)),
    ]);

    const projectName = buildProjectName(projectRoot, context.workspaceRoot, options);

    targetsCache[hash] ??= buildTargets(projectRoot, options, projectName);

    return {
      projects: {
        [projectRoot]: {
          targets: targetsCache[hash],
        },
      },
    };
  },
];

function buildTargets(projectRoot: string, options: ContainerPluginOptions, projectName: string) {
  const targets: Record<string, TargetConfiguration> = {
    [options.buildTargetName]: {
      executor: '@nx-tools/nx-container:build',
      dependsOn: ['build'],
      options: {
        engine: options.defaultEngine,
        tags: [`${projectName}:dev`],
        load: true,
      },
      configurations: {
        ci: {
          load: false,
          push: true,
          metadata: {
            images: [projectName],
            tags: [
              'type=schedule',
              'type=ref,event=branch',
              'type=ref,event=tag',
              'type=ref,event=pr',
              'type=sha,prefix=sha-',
            ],
          },
        },
      },
    },
  };

  return targets;
}

function buildProjectName(
  projectRoot: string,
  workspaceRoot: string,
  options: ContainerPluginOptions
): string | undefined {
  const packageJsonPath = join(workspaceRoot, projectRoot, 'package.json');
  const projectJsonPath = join(workspaceRoot, projectRoot, 'project.json');
  let name: string;
  const registry = options.defaultRegistry.length ? `${options.defaultRegistry}/` : '';
  if (existsSync(projectJsonPath)) {
    const projectJson = parseJson(readFileSync(projectJsonPath, 'utf-8'));
    name = `${registry}${projectJson.name}`;
  } else if (existsSync(packageJsonPath)) {
    const packageJson = parseJson(readFileSync(packageJsonPath, 'utf-8'));
    name = `${registry}${packageJson.name}`;
  }
  return name.replace(/@/gi, '');
}

function normalizeOptions(options: ContainerPluginOptions): ContainerPluginOptions {
  options ??= {};
  options.buildTargetName ??= 'container';
  options.defaultEngine ??= DEFAULT_ENGINE;
  options.defaultRegistry ??= DEFAULT_REGISTRY;
  return options;
}
