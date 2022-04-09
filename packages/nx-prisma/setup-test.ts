import { rmdirSync, rmSync } from 'fs';
import { resolve } from 'path';

const fn = rmSync || rmdirSync;

module.exports = async () => {
  fn(resolve(__dirname, './tests/migrations'), { recursive: true, force: true });
  fn(resolve(__dirname, './tests/artifacts'), { recursive: true, force: true });
};
