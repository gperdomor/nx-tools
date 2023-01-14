import * as url from 'url';
import { readFile } from 'fs/promises';
import { propertiesToJson } from 'properties-file/content';

export type BuildProperties = Awaited<ReturnType<typeof getProperties>>['buildProperties'];
export type ConfigProperties = Awaited<ReturnType<typeof getProperties>>['configProperties'];

export async function getProperties() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const buildPropertiesFile = await readFile(process.env['TEAMCITY_BUILD_PROPERTIES_FILE']!, 'utf8');
  const buildProperties = propertiesToJson(buildPropertiesFile);

  const configPropertiesFile = await readFile(buildProperties['teamcity.configuration.properties.file'], 'utf8');
  const configProperties = propertiesToJson(configPropertiesFile);

  return { buildProperties, configProperties };
}

export function getActor(configProperties: ConfigProperties) {
  const actor = configProperties['teamcity.build.triggeredBy.username'];
  if (actor === 'n/a') return;
  return actor;
}

export function getBranchRef(configProperties: ConfigProperties) {
  let [, branch] = Object.entries(configProperties).find(([key]) => key.startsWith('teamcity.build.vcs.branch.')) ?? [];

  if (typeof branch !== 'string') {
    branch = configProperties['teamcity.build.branch'];
  }

  if (typeof branch !== 'string') return;

  if (branch.startsWith('refs/')) return branch;

  return `refs/heads/${branch}`;
}

export function getRepoURL(configProperties: ConfigProperties) {
  let [, repo] =
    Object.entries(configProperties).find(([key]) => key.startsWith('vcsroot.') && key.endsWith('.url')) ?? [];

  if (typeof repo !== 'string') {
    repo = configProperties['vcsroot.url'];
  }

  if (typeof repo !== 'string') return;

  const ensureProto = !repo.match(/^(\w+:)?\/\//) ? '//' : '';

  // use node:url for ssh support, which URL doesn't have
  const repoURL = url.parse(ensureProto + repo.replace(/\.git$/, ''));
  repoURL.host = repoURL.hostname;
  repoURL.auth = '';
  repoURL.protocol = 'https';
  repoURL.pathname = repoURL.pathname?.replace('/:', '/') ?? null;

  if (configProperties['version'] === 'gerrit') {
    const DEFAULT_GERRIT_SSH_PORT = '29418';
    repoURL.port = repoURL.port === DEFAULT_GERRIT_SSH_PORT ? null : repoURL.port;
    repoURL.pathname = repoURL.pathname ? `/q/project:` + encodeURIComponent(repoURL.pathname.substring(1)) : '';
  }

  return url.format(repoURL);
}
