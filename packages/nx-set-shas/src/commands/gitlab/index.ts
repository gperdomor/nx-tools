import { Command, Flags } from '@oclif/core';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fetch } from 'undici';

const defaultWorkingDirectory = '.';

export default class GitLab extends Command {
  static override description = 'Find latest successful pipeline of gitlab project';

  static override examples = ['$ nx-set-shas gitlab', '$ nx-set-shas gitlab -t=gitlab-token'];

  static override flags = {
    // token: Flags.string({ char: 't', description: 'Authentication Token', env: 'CI_JOB_TOKEN', required: true }),
    token: Flags.string({ char: 't', description: 'Authentication Token', required: false }),
    branch: Flags.string({
      char: 'b',
      description: 'The name of the main branch in your repo, used as the target of PRs. E.g. main, master etc',
      env: 'CI_DEFAULT_BRANCH',
      required: true,
    }),
    project: Flags.integer({ char: 'p', description: 'The ID of the project.', env: 'CI_PROJECT_ID', required: true }),
    outputFile: Flags.string({ char: 'o' }),
    workingDirectory: Flags.string({
      char: 'd',
      description: 'The directory where your repository is located',
      default: defaultWorkingDirectory,
    }),
    'error-on-no-successful-pipeline': Flags.boolean({
      description:
        'By default, if no successful pipeline is found on the main branch to determine the SHA, we will log a warning and use HEAD~1. Enable this option to error and exit instead.',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GitLab);

    const {
      branch,
      project,
      token,
      'error-on-no-successful-pipeline': errorOnNoSuccessfulPipeline,
      outputFile,
      workingDirectory,
    } = flags;

    if (workingDirectory !== defaultWorkingDirectory) {
      if (existsSync(workingDirectory)) {
        this.debug('--> __dirname', __dirname);
        process.chdir(join(__dirname, workingDirectory));
      } else {
        this.log('\n');
        this.log(`WARNING: Working directory '${workingDirectory}' doesn't exist.\n`);
      }
    }

    let BASE_SHA;
    const eventName = process.env['CI_MERGE_REQUEST_ID'] ? 'pull_request' : '';
    let HEAD_SHA = execSync(`git rev-parse HEAD`, { encoding: 'utf-8' }).trim();

    if (eventName === 'pull_request') {
      BASE_SHA = execSync(`git merge-base origin/${branch} HEAD`, { encoding: 'utf-8' });
    } else {
      try {
        BASE_SHA = await this.findSuccessfulCommit(project, branch, token);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.error(e.message);
        return;
      }

      if (!BASE_SHA) {
        if (errorOnNoSuccessfulPipeline) {
          this.reportFailure(branch);
          return;
        } else {
          this.warn('\n');
          this.warn(`WARNING: Unable to find a successful pipeline run on 'origin/${branch}'\n`);
          this.warn(`We are therefore defaulting to use HEAD~1 on 'origin/${branch}'\n`);
          this.warn('\n');
          this.warn(
            `NOTE: You can instead make this a hard error by setting flag 'error-on-no-successful-pipeline' on the running script.\n`
          );

          BASE_SHA = execSync(`git rev-parse HEAD~1`, { encoding: 'utf-8' });
        }
      } else {
        this.log('\n');
        this.log(`Found the last successful pipeline run on 'origin/${branch}'\n`);
        this.log(`Commit: ${BASE_SHA}\n`);
      }
    }

    const stripNewLineEndings = (sha: string) => sha.replace('\n', '');
    BASE_SHA = stripNewLineEndings(BASE_SHA);
    HEAD_SHA = stripNewLineEndings(HEAD_SHA);
    this.log('NX_BASE', BASE_SHA);
    this.log('NX_HEAD', HEAD_SHA);

    let lines: string[] = [];

    if (outputFile) {
      if (existsSync(outputFile)) {
        const variables = readFileSync(outputFile).toString('utf-8').split('\n');
        lines = variables.filter(
          (variable) => !(variable.startsWith('NX_BASE') || variable.startsWith('NX_HEAD') || variable === '')
        );
      }

      lines.push(`NX_BASE=${BASE_SHA}`, `NX_HEAD=${HEAD_SHA}`);

      writeFileSync(outputFile, lines.join('\n'), { encoding: 'utf-8' });

      this.log(`NX_BASE and NX_HEAD environment variables have been written to '${outputFile}'`);
    }
  }

  /**
   * Find last successful pipeline run on the repo
   * @param {number} project
   * @param {string} branch
   * @param {string} token
   * @returns
   */
  async findSuccessfulCommit(project: number, branch: string, token: string | undefined): Promise<string | undefined> {
    const params: Record<string, string> = {
      scope: 'finished',
      status: 'success',
      ref: branch,
      per_page: '50',
    };

    const response = await fetch(
      `https://gitlab.com/api/v4/projects/${project}/pipelines?${new URLSearchParams(params).toString()}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );

    const json: any = await response.json();

    let shas: string[];

    if (response.ok) {
      shas = json.map((pipeline: { sha: string }) => pipeline.sha);
    } else {
      this.error(json.message);
    }

    return this.findExistingCommit(shas);
  }

  /**
   * Get first existing commit
   * @param {string[]} commit_shas
   * @returns {string?}
   */
  async findExistingCommit(shas: string[]): Promise<string | undefined> {
    for (const commitSha of shas) {
      if (await this.commitExists(commitSha)) {
        return commitSha;
      }
    }
    return undefined;
  }

  /**
   * Check if given commit is valid
   * @param {string} commitSha
   * @returns {boolean}
   */
  async commitExists(commitSha: string) {
    try {
      execSync(`git cat-file -e ${commitSha}`, { stdio: ['pipe', 'pipe', null] });
      return true;
    } catch {
      return false;
    }
  }

  reportFailure(branchName: string) {
    this.error(`
      Unable to find a successful pipeline run on 'origin/${branchName}'
      NOTE: You have set 'error-on-no-successful-pipeline' on the script so this is a hard error.
      Is it possible that you have no runs currently on 'origin/${branchName}'?
      - If yes, then you should run the pipeline without this flag first.
      - If no, then you might have changed your git history and those commits no longer exist.`);
  }
}
