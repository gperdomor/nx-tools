import * as dotenv from 'dotenv';
import * as fs from 'node:fs';

export const mockConsole = () => {
  vi.spyOn(console, 'info').mockImplementation(() => true);
  vi.spyOn(console, 'log').mockImplementation(() => true);
  vi.spyOn(console, 'warn').mockImplementation(() => true);
};

export const stubEnvsFromFile = (envFile: string) => {
  const envs = dotenv.parse(fs.readFileSync(envFile));

  Object.keys(envs).forEach((key) => {
    vi.stubEnv(key, envs[key]);
  });
};

it('should work', () => {
  expect(true).toBeTruthy();
});
