import { BuildOptions, Git } from '../interfaces';

const opencontainersLabelPrefix = 'org.opencontainers.image';

// getLabels gets a list of all labels to build the image with including automatic labels created from github vars when AddGitLabels is true
export const getLabels = (build: BuildOptions, git: Git): string[] => {
  let labels: string[] = [];

  if (build.labels) {
    labels = build.labels;
  }

  if (!build.addGitLabels) {
    return labels;
  }

  if (git.repository !== '') {
    // TODO: FIX
    labels.push(`${opencontainersLabelPrefix}.source=${git.repository}`);
  }

  if (git.sha !== '') {
    labels.push(`${opencontainersLabelPrefix}.revision=${git.sha}`);
  }

  const createdTime = new Date().toISOString();
  labels.push(`${opencontainersLabelPrefix}.created=${createdTime}`);

  return labels;
};
