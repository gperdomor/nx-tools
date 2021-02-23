import { rmSync } from 'fs';
import { resolve } from 'path';

export default () => {
  rmSync(resolve(__dirname, './tests/migrations'), { recursive: true, force: true });
  rmSync(resolve(__dirname, './tests/artifacts'), { recursive: true, force: true });
};
