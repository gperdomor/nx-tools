import { Command, Option } from 'clipanion';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { stripNewLineEndings, validateNodejsVersion } from '../helpers';
import { Context } from '../types';
import { findSuccessfulCommit } from './gitlab.helpers';

const defaultWorkingDirectory = '.';

export class GitLabCommand extends Command<Context> {
  static override paths = [[`gitlab`]];

  static override usage = Command.Usage({
    category: `GitLab commands`,
    description: `Find the base and head SHAs required for the nx affected commands in GitLab CI.`,
    // details: `
    //   A longer description of the command with some \`markdown code\`.

    //   Multiple paragraphs are allowed. Clipanion will take care of both reindenting the content and wrapping the paragraphs as needed.
    // `,
    examples: [
      [`A basic example`, `$0 gitlab --project 40806764 --branch main`],
      [`With an private token`, `$0 gitlab --project 40806764 --branch main --token glpat-xxxxxxxx`],
      [`With custom env var output`, `$0 gitlab --project 40806764 --branch main --output .env`],
    ],
  });

  mainBranchName = Option.String(`--branch,-b`, 'main', {
    description: 'The name of the main branch in your repo, used as the target of PRs. E.g. main, master etc.',
    env: 'CI_DEFAULT_BRANCH',
  });

  errorOnNoSuccessfulPipeline = Option.Boolean('--error-on-no-successful-pipeline', false, {
    description:
      'By default, if no successful workflow is found on the main branch to determine the SHA, we will log a warning and use HEAD~1. Enable this option to error and exit instead.',
  });

  lastSuccessfulEvent = Option.String(`--last-successful-event`, 'push', {
    description:
      'The type of event to check for the last successful commit corresponding to that workflow-id, e.g. push, pull_request, release etc.',
  });

  workingDirectory = Option.String('--working-dir,-d', defaultWorkingDirectory, {
    description: 'The directory where your repository is located.',
  });

  project = Option.String('--project,-p', {
    description: 'The ID of the GitLab project.',
    env: 'CI_PROJECT_ID',
    required: true,
  });

  token = Option.String('--token,-t', {
    description: 'GitLab API authentication token. If is not provided, the CI Job token will be used.',
  });

  output = Option.String('--output,-o', {
    description: 'Output file where the env variables will be setted.',
  });

  reportFailure = () => {
    this.context.logger.error(`
      Unable to find a successful workflow run on 'origin/${this.mainBranchName}'
      NOTE: You have set 'error-on-no-successful-workflow' on the action so this is a hard error.
      Is it possible that you have no runs currently on 'origin/${this.mainBranchName}'?
      - If yes, then you should run the workflow without this flag first.
      - If no, then you might have changed your git history and those commits no longer exist.`);
  };

  async execute() {
    if (!validateNodejsVersion(this.context)) {
      return 1;
    }

    const {
      workingDirectory,
      errorOnNoSuccessfulPipeline,
      lastSuccessfulEvent,
      mainBranchName,
      project,
      token,
      output,
    } = this;

    if (this.workingDirectory !== defaultWorkingDirectory) {
      if (existsSync(workingDirectory)) {
        process.chdir(workingDirectory);
      } else {
        this.context.logger.warn('\n');
        this.context.logger.warn(`WARNING: Working directory '${workingDirectory}' doesn't exist.\n`);
      }
    }

    let BASE_SHA: string | undefined;

    const eventName = process.env['CI_MERGE_REQUEST_ID'] ? 'pull_request' : '';

    const headResult = spawnSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf-8',
    });

    let HEAD_SHA = headResult.stdout.trim();

    if (eventName === 'pull_request') {
      try {
        const baseResult = spawnSync('git', ['merge-base', `origin/${mainBranchName}`, 'HEAD'], { encoding: 'utf-8' });
        BASE_SHA = baseResult.stdout;
      } catch (e) {
        let message: string;
        if (e instanceof Error) {
          message = e.message;
        } else {
          message = String(e);
        }

        this.context.logger.error(`${message}\n`);
        return 1;
      }
    } else {
      try {
        BASE_SHA = await findSuccessfulCommit({ lastSuccessfulEvent, mainBranchName, project, token });
      } catch (e) {
        let message: string;
        if (e instanceof Error) {
          message = e.message;
        } else {
          message = String(e);
        }
        this.context.logger.error(`${message}\n`);
        return 1;
      }

      if (!BASE_SHA) {
        if (errorOnNoSuccessfulPipeline) {
          this.reportFailure();
          return 1;
        } else {
          this.context.logger.warn('\n');
          this.context.logger.warn(
            `WARNING: Unable to find a successful workflow run on 'origin/${mainBranchName}', or the latest successful workflow was connected to a commit which no longer exists on that branch (e.g. if that branch was rebased)\n`,
          );
          this.context.logger.warn(`We are therefore defaulting to use HEAD~1 on 'origin/${mainBranchName}'\n`);
          this.context.logger.warn('\n');
          this.context.logger.warn(
            `NOTE: You can instead make this a hard error by setting 'error-on-no-successful-workflow' on the action in your workflow.\n`,
          );
          this.context.logger.warn('\n');

          const commitCountOutput = spawnSync('git', ['rev-list', '--count', `origin/${mainBranchName}`], {
            encoding: 'utf-8',
          }).stdout.trim();
          const commitCount = parseInt(stripNewLineEndings(commitCountOutput), 10);

          const LAST_COMMIT_CMD = `origin/${mainBranchName}${commitCount > 1 ? '~1' : ''}`;
          const baseRes = spawnSync('git', ['rev-parse', LAST_COMMIT_CMD], {
            encoding: 'utf-8',
          });
          BASE_SHA = baseRes.stdout.trim();
        }
      } else {
        this.context.logger.info('\n');
        this.context.logger.info(`Found the last successful workflow run on 'origin/${mainBranchName}'\n`);
        this.context.logger.info(`Commit: ${BASE_SHA}\n\n`);
      }
    }

    BASE_SHA = stripNewLineEndings(BASE_SHA);
    HEAD_SHA = stripNewLineEndings(HEAD_SHA);
    this.context.logger.info(`NX_BASE: ${BASE_SHA}\n`);
    this.context.logger.info(`NX_HEAD: ${HEAD_SHA}\n`);

    let lines: string[] = [];

    if (output) {
      if (existsSync(output)) {
        const variables = readFileSync(output).toString('utf-8').split('\n');
        lines = variables.filter(
          (variable) => !(variable.startsWith('NX_BASE') || variable.startsWith('NX_HEAD') || variable === ''),
        );
      }
      lines.push(`NX_BASE=${BASE_SHA}`, `NX_HEAD=${HEAD_SHA}`);
      writeFileSync(output, lines.join('\n'), { encoding: 'utf-8' });
      this.context.logger.info(`NX_BASE and NX_HEAD environment variables have been written to '${output}'\n`);
    }

    return 0;
  }
}
