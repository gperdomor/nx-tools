/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RepoMetadata, RunnerContext } from '../interfaces';
import { getCommitUserEmail } from './local-helpers';
import { getActor, getBranchRef, getProperties, getRepoURL } from './teamcity-helpers';

// TeamCity docs: https://www.jetbrains.com/help/teamcity/predefined-build-parameters.html

export async function context(): Promise<RunnerContext> {
  const { buildProperties, configProperties } = await getProperties();

  return {
    actor: getActor(configProperties) || (await getCommitUserEmail().catch(() => 'n/a')),
    eventName: configProperties['teamcity.build.triggeredBy'] || 'unknown',
    job: buildProperties['teamcity.buildConfName']!,
    payload: {},
    ref: getBranchRef(configProperties) || '',
    runId: parseInt(buildProperties['teamcity.build.id'], 10),
    runNumber: parseInt(buildProperties['build.number'], 10),
    sha: buildProperties['build.vcs.number'],
  };
}

export async function repo(): Promise<RepoMetadata> {
  const { buildProperties, configProperties } = await getProperties();

  return {
    default_branch: configProperties['git.main.branch'] || '',
    description: '',
    html_url: getRepoURL(configProperties) || '',
    license: null,
    name: buildProperties['teamcity.projectName'],
  };
}
