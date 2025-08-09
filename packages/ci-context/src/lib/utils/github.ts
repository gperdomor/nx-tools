import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context.js';
import { logger, toBoolean } from '@nx-tools/core';
import { Payload, RepoMetadata, RunnerContext } from '../interfaces.js';

export class Github {
  public static async context(): Promise<RunnerContext> {
    const ctx = new Context();
    const { actor, eventName, job, runId, runNumber, payload } = ctx;

    const repoUrl = this.buildRepoUrl(ctx);
    const ref = this.determineRef(ctx);
    const sha = this.determineSha(ctx);

    return {
      name: 'GITHUB',
      actor,
      eventName,
      job,
      payload: payload as unknown as Payload,
      ref,
      runId,
      runNumber,
      repoUrl,
      sha,
    };
  }

  /**
   * Build repository URL with proper error handling
   */
  private static buildRepoUrl(ctx: Context): string {
    try {
      if (!ctx.repo?.owner || !ctx.repo?.repo) {
        logger.warn('Repository information not available in context');
        return '';
      }
      return `${ctx.serverUrl}/${ctx.repo.owner}/${ctx.repo.repo}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to build repository URL: ${message}`);
      return '';
    }
  }

  /**
   * Determine the correct Git reference based on event type
   */
  private static determineRef(ctx: Context): string {
    // Override Git reference with PR ref for pull_request_target event
    // https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request_target
    if (ctx.eventName === 'pull_request_target') {
      return `refs/pull/${ctx.payload.number}/merge`;
    }

    return ctx.ref;
  }

  /**
   * Determine the correct SHA based on environment configuration and event type
   */
  private static determineSha(ctx: Context): string {
    // DOCKER_METADATA_PR_HEAD_SHA env var can be used to set associated head
    // SHA instead of commit SHA that triggered the workflow on pull request
    // event.
    if (toBoolean(process.env.DOCKER_METADATA_PR_HEAD_SHA)) {
      if (
        (ctx.eventName === 'pull_request' || ctx.eventName === 'pull_request_target') &&
        ctx.payload?.pull_request?.head?.sha != undefined
      ) {
        return ctx.payload.pull_request.head.sha;
      }
    }

    return ctx.sha;
  }
}

export async function repo(token?: string): Promise<RepoMetadata> {
  if (!token) {
    throw new Error(`Missing github token`);
  }

  const response = await github.getOctokit(token).rest.repos.get({
    ...github.context.repo,
  });

  const { default_branch, description, html_url, license, name } = response.data;

  return {
    default_branch,
    description,
    html_url,
    license,
    name,
  };
}
