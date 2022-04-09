import { getExecOutput } from '@nx-tools/core';

export const getRef = async () => {
  const output = await getExecOutput('git symbolic-ref HEAD');
  return output.stdout.trim();
};

export const getCommitUserEmail = async () => {
  const output = await getExecOutput('git log -1 --pretty=format:%ae');
  return output.stdout.trim();
};

export const getSha = async () => {
  const output = await getExecOutput('git rev-parse HEAD');
  return output.stdout.trim();
};
