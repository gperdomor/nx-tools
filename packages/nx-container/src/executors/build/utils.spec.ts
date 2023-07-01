import { expandEnvVars } from './utils';

describe('utils', () => {
  it('should expand ${HOME}', () => {
    expect(expandEnvVars('${HOME}')).toEqual(process.env.HOME);
  });

  it('should expand $HOME', () => {
    expect(expandEnvVars('$HOME')).toEqual(process.env.HOME);
  });

  it('should not expand ', () => {
    const value = 'HOME';
    expect(expandEnvVars(value)).toEqual(value);
  });
});
