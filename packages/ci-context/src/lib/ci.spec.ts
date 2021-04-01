import { getVendor } from './ci';
import { Vendor } from './vendors';

describe('CI', () => {
  let env: NodeJS.ProcessEnv;

  beforeEach(() => {
    env = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = env;
  });

  describe('getRunnerProvider', () => {
    describe('When is GitLabCI', () => {
      beforeEach(() => {
        process.env.GITLAB_CI = 'true';
      });

      it('Should return GitLab context', () => {
        expect(getVendor()).toEqual(Vendor.GITLAB);
      });
    });

    describe('When is GitHub Actions', () => {
      beforeEach(() => {
        process.env.GITHUB_ACTIONS = 'true';
      });

      it('Should return GitHub context', () => {
        expect(getVendor()).toEqual(Vendor.GITHUB_ACTIONS);
      });
    });

    describe('When is Circle CI', () => {
      beforeEach(() => {
        process.env.CIRCLECI = 'true';
      });

      it('Should return Circle context', () => {
        expect(getVendor()).toEqual(Vendor.CIRCLE);
      });
    });

    describe('When is local', () => {
      beforeEach(() => {
        process.env.PATH = 'true';
      });

      it('Should return local context', () => {
        expect(getVendor()).toEqual(Vendor.LOCAL_MACHINE);
      });
    });

    describe('When is unknown', () => {
      it('Should throw error', () => {
        expect(getVendor()).toBeUndefined();
      });
    });
  });
});
