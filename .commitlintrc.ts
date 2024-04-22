import { utils } from '@commitlint/config-nx-scopes';

module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'scope-enum': async (ctx) => [2, 'always', ['release', ...(await utils.getProjects(ctx))]],
  },
};
