import { exec } from '@nx-tools/core';
import { Command, Flags } from '@oclif/core';
import { colorize } from '@oclif/core/ux';
import { existsSync } from 'node:fs';

const DEFAULT_WORKING_DIRECTORY = '.';
const EVENT_OPTIONS = ['push', 'merge_request_event'] as const;
type MrEventType = (typeof EVENT_OPTIONS)[number];

export const stripNewLineEndings = (string: string): string => string.replace('\n', '');

export default class Gitlab extends Command {
  static override enableJsonFlag = true;
  static override description = 'Find the base and head SHAs required for the nx affected commands in GitLab CI';
  //   static override examples = [
  //     `<%= config.bin %> <%= command.id %> friend --from oclif
  // hello friend from oclif! (./src/commands/hello/index.ts)
  // `,
  //   ];
  static override flags = {
    branch: Flags.string({
      char: 'b',
      default: 'main',
      description:
        'The "main" branch of your repository (the base branch which you target with PRs). Common names for this branch include main and master.',
      env: 'CI_DEFAULT_BRANCH',
    }),
    'error-on-no-successful-pipeline': Flags.boolean({
      default: false,
      description:
        'By default, if no successful pipeline run is found on the main branch to determine the SHA, we will log a warning and use HEAD~1. Enable this option to error and exit instead.',
    }),
    fallback: Flags.string({
      char: 'f',
      default: '',
      description:
        'Fallback SHA to use if no successful pipeline run is found. This can be useful in scenarios where you need a specific commit as a reference for comparison, especially in newly set up repositories or those with sparse pipeline runs.',
    }),
    'last-successful-event': Flags.string({
      default: 'push',
      description:
        'The type of event to check for the last successful commit corresponding to that pipeline-id, e.g. push, pull_request, release etc.',
      options: EVENT_OPTIONS,
    }),
    // output: Flags.string({
    //   char: 'o',
    //   description: 'Output file where the env variables will be setted.',
    // }),
    project: Flags.string({
      char: 'p',
      description: 'The ID of the GitLab project.',
      env: 'CI_PROJECT_ID',
      required: true,
    }),
    remote: Flags.string({
      char: 'r',
      default: 'origin',
      description: 'The name of the remote to fetch from.',
    }),
    token: Flags.string({
      char: 't',
      description: 'GitLab API authentication token. If is not provided, the CI Job token will be used.',
    }),
    'working-directory': Flags.string({
      char: 'd',
      default: DEFAULT_WORKING_DIRECTORY,
      description: 'The directory where your repository is located.',
      //   required: true,
    }),
  };

  async run(): Promise<{ NX_BASE: string; NX_HEAD: string }> {
    const { flags } = await this.parse(Gitlab);
    const {
      remote,
      branch,
      fallback,
      project,
      token,
      'working-directory': workingDirectory,
      'error-on-no-successful-pipeline': errorOnNoSuccessfulPipeline,
      'last-successful-event': lastSuccessfulEvent,
    } = flags;

    console.log(lastSuccessfulEvent, project, token);

    this.setupWorkingDirectory(workingDirectory);

    let BASE_SHA: string;
    let HEAD_SHA = await this.getHEAD();

    const eventName = process.env.CI_MERGE_REQUEST_IID ? 'merge_request_event' : '';

    if (eventName === 'merge_request_event' && process.env.CI_MERGE_REQUEST_EVENT_TYPE !== 'merged_result') {
      BASE_SHA = await this.getBASE(remote);
    } else {
      BASE_SHA = await this.findSuccessfulCommit({
        lastSuccessfulEvent: lastSuccessfulEvent as MrEventType,
        branch,
        project,
        token,
      });

      if (!BASE_SHA) {
        if (errorOnNoSuccessfulPipeline) {
          this.error(
            colorize(
              'red',
              [
                `Unable to find a successful pipeline run on 'origin/${branch}'`,
                `NOTE: You have set 'error-on-no-successful-pipeline' on the action so this is a hard error.`,
                `Is it possible that you have no runs currently on 'origin/${branch}'?`,
                `- If yes, then you should run the pipeline without this flag first.`,
                `- If no, then you might have changed your git history and those commits no longer exist.`,
                `\n`,
              ].join('\n'),
            ),
            { code: 'NO_SUCCESSFUL_PIPELINE', exit: 1 },
          );
        } else {
          this.log(
            colorize(
              'yellow',
              `WARNING: Unable to find a successful pipeline run on '${remote}/${branch}', or the latest successful pipeline was connected to a commit which no longer exists on that branch (e.g. if that branch was rebased).\n`,
            ),
          );

          if (fallback) {
            BASE_SHA = fallback;
            this.log(`Using provided fallback SHA: ${BASE_SHA}\n`);
          } else {
            // Check if HEAD~1 exists, and if not, set BASE_SHA to the empty tree hash
            const LAST_COMMIT_CMD = `${remote}/${branch}~1`;
            const baseRes = await exec('git', ['rev-parse', LAST_COMMIT_CMD]);

            if (baseRes.exitCode !== 0 || !baseRes.stdout.trim()) {
              const emptyTreeRes = await exec('git', ['hash-object', '-t', 'tree', '/dev/null']);

              // 4b825dc642cb6eb9a060e54bf8d69288fbee4904 is the expected result of hashing the empty tree
              BASE_SHA = emptyTreeRes.stdout ?? `4b825dc642cb6eb9a060e54bf8d69288fbee4904`;
              this.log(
                colorize(
                  'yellow',
                  `HEAD~1 does not exist. We are therefore defaulting to use the empty git tree hash as BASE.\n`,
                ),
              );
            } else {
              this.log(colorize('yellow', `We are therefore defaulting to use HEAD~1 on '${remote}/${branch}'\n`));

              BASE_SHA = baseRes.stdout.trim();
            }

            this.log(
              `NOTE: You can instead make this a hard error by setting 'error-on-no-successful-pipeline' on the action in your pipeline.\n`,
            );
          }
        }
      } else {
        this.log(
          [`Found the last successful workflow run on '${remote}/${branch}'`, `Commit: ${BASE_SHA}`, '\n'].join('\n'),
        );
      }
    }

    BASE_SHA = stripNewLineEndings(BASE_SHA);
    HEAD_SHA = stripNewLineEndings(HEAD_SHA);

    this.log(colorize('blue', [`NX_BASE: ${BASE_SHA}`, `NX_HEAD: ${HEAD_SHA}`].join('\n')));

    // handle output

    return {
      NX_BASE: BASE_SHA,
      NX_HEAD: HEAD_SHA,
    };
  }

  setupWorkingDirectory(workingDirectory: string) {
    if (workingDirectory !== DEFAULT_WORKING_DIRECTORY) {
      if (existsSync(workingDirectory)) {
        process.chdir(workingDirectory);
      } else {
        this.log(colorize('yellow', `WARNING: Working directory '${workingDirectory}' doesn't exist.\n`));
      }
    }
  }

  async getBASE(remote: string): Promise<string> {
    const cmd = await exec('git', [
      'merge-base',
      `${remote}/${process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME}`,
      'HEAD',
    ]);
    return cmd.stdout.trim();
  }

  async getHEAD(): Promise<string> {
    const cmd = await exec('git', ['rev-parse', 'HEAD']);
    return cmd.stdout.trim();
  }

  async findSuccessfulCommit({
    branch,
    lastSuccessfulEvent,
    project,
    token,
  }: {
    branch: string;
    lastSuccessfulEvent: MrEventType;
    project: string;
    token?: string;
  }): Promise<string | undefined> {
    const params = new URLSearchParams({
      per_page: '100',
      scope: 'finished',
      source: lastSuccessfulEvent,
      status: 'success',
    });

    if (lastSuccessfulEvent === 'push') {
      params.append('ref', branch);
    }

    return '';
  }
}
