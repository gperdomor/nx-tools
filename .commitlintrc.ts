import nxScopes from '@commitlint/config-nx-scopes';
import { type UserConfig, RuleConfigSeverity } from '@commitlint/types';

const { utils } = nxScopes;

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'scope-enum': async (ctx) => [
      RuleConfigSeverity.Error,
      'always',
      ['deps', 'release', ...(await utils.getProjects(ctx))],
    ],
  },
};

export default Configuration;
