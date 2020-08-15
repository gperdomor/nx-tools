import { BuildOptions, Git, Login } from '../interfaces';
import { getLabels } from './label.utils';

export const getLoginArgs = (login: Login, registry?: string): string[] => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const args = ['--username', login.username!, '--password', login.password!];

  if (registry) {
    args.push(registry);
  }

  return args;
};

export const getBuildArgs = (o: BuildOptions, git: Git, tags: string[]): string[] => {
  const args: string[] = ['--progress', 'plain'];

  for (const tag of tags) {
    args.push('-t', tag);
  }

  for (const label of getLabels(o, git)) {
    args.push('--label', label);
  }

  if (o.dockerfile) {
    args.push('--file', o.dockerfile);
  }

  if (o.target) {
    args.push('--target', o.target);
  }

  if (o.alwaysPull) {
    args.push('--pull');
  }

  for (const cacheFrom of o.cacheFroms) {
    args.push('--cache-from', cacheFrom);
  }

  for (const buildArg of o.buildArgs) {
    args.push('--build-arg', buildArg);
  }

  args.push(o.path);

  return args;
};
