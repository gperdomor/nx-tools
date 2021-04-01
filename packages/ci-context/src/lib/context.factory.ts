import { getVendor } from './ci';
import { CircleContext } from './contexts/circle.context';
import { CIContext } from './contexts/context';
import { GitHubContext } from './contexts/github.context';
import { GitLabContext } from './contexts/gitlab.context';
import { LocalContext } from './contexts/local.context';
import { Vendor } from './vendors';

export class ContextProxyFactory {
  public static create(): CIContext {
    switch (getVendor()) {
      case Vendor.CIRCLE:
        return new CircleContext();

      case Vendor.GITHUB_ACTIONS:
        return new GitHubContext();

      case Vendor.GITLAB:
        return new GitLabContext();

      case Vendor.LOCAL_MACHINE:
        return new LocalContext();

      default:
        throw new Error('Unsupported runner provider');
    }
  }
}
