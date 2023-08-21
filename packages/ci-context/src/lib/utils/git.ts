import { ExecOutput, getExecOutput } from '@nx-tools/core';
import { RepoMetadata, RunnerContext } from '../interfaces';

export class Git {
  public static async context(): Promise<RunnerContext> {
    return {
      name: 'GIT',
      actor: await Git.getCommitUserEmail(),
      eventName: 'push',
      job: 'build',
      payload: {},
      ref: await Git.ref(),
      runId: 0,
      runNumber: 0,
      repoUrl: await Git.remoteURL(),
      sha: await Git.fullCommit(),
    };
  }

  public static async remoteURL(): Promise<string> {
    return await Git.exec(['remote', 'get-url', 'origin']).then((rurl) => {
      if (rurl.length == 0) {
        return Git.exec(['remote', 'get-url', 'upstream']).then((rurl) => {
          if (rurl.length == 0) {
            throw new Error(`Cannot find remote URL for origin or upstream`);
          }
          return rurl;
        });
      }
      return rurl;
    });
  }

  public static async ref(): Promise<string> {
    return await Git.exec(['symbolic-ref', 'HEAD']).catch(() => {
      // if it fails (for example in a detached HEAD state), falls back to
      // using git tag or describe to get the exact matching tag name.
      return Git.tag().then((tag) => {
        return `refs/tags/${tag}`;
      });
    });
  }

  public static async fullCommit(): Promise<string> {
    return await Git.exec(['show', '--format=%H', 'HEAD', '--quiet', '--']);
  }

  public static async tag(): Promise<string> {
    return await Git.exec(['tag', '--points-at', 'HEAD', '--sort', '-version:creatordate']).then((tags) => {
      if (tags.length == 0) {
        return Git.exec(['describe', '--tags', '--abbrev=0']);
      }
      return tags.split('\n')[0];
    });
  }

  public static async getCommitUserEmail(): Promise<string> {
    return await Git.exec(['log', '-1', '--pretty=format:%ae']);
  }

  private static async exec(args: string[] = []): Promise<string> {
    return await getExecOutput(`git`, args, {
      ignoreReturnCode: true,
      silent: true,
    }).then((res: ExecOutput) => {
      if (res.stderr.length > 0 && res.exitCode != 0) {
        throw new Error(res.stderr);
      }
      return res.stdout.trim();
    });
  }
}

export async function repo(): Promise<RepoMetadata> {
  return {
    default_branch: '',
    description: '',
    html_url: await Git.remoteURL(),
    license: null,
    name: '',
  };
}
