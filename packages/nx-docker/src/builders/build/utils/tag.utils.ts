import { GitReferenceType } from '../enums/git.enum';
import { Git } from '../interfaces';
import { BuildBuilderSchema } from '../schema';

const toFullTag = (registry: string, repo: string, tag: string): string => {
  tag = tag.trim();
  if (registry) {
    return `${registry}/${repo}:${tag}`;
  }
  return `${repo}:${tag}`;
};

const appendShortGitShaTag = (tags: string[], git: Git, registry: string, repo: string) => {
  if (git.sha.length >= 7) {
    const tag = `sha-${git.sha.slice(0, 7)}`;
    tags.push(toFullTag(registry, repo, tag));
  }
};

const appendGitRefTag = (tags: string[], registry: string, repo: string, refName: string) => {
  const tag = refName.replace('/', '-');
  return tags.push(toFullTag(registry, repo, tag));
};

// GetTags gets a list of all tags for including automatic tags from github vars when enabled along with the registry and repository
export const getTags = (options: BuildBuilderSchema, git: Git): string[] => {
  const repo = options.repository.toLowerCase();
  const tags: string[] = [];

  for (const tag of options.tags?.split(',') || []) {
    tags.push(toFullTag(options.registry, repo, tag));
  }

  if (options.tagWithRef) {
    switch (git.reference.type) {
      case GitReferenceType.GitRefHead:
        if (git.reference.name === 'master') {
          tags.push(toFullTag(options.registry, repo, 'latest'));
        } else {
          appendGitRefTag(tags, options.registry, repo, git.reference.name);
        }
        break;
      case GitReferenceType.GitRefPullRequest:
        appendGitRefTag(tags, options.registry, repo, `pr-${git.reference.name}`);
        break;
      case GitReferenceType.GitRefTag:
        appendGitRefTag(tags, options.registry, repo, git.reference.name);
        break;
    }
  }

  if (options.tagWithSha) {
    appendShortGitShaTag(tags, git, options.registry, repo);
  }

  return tags;
};
