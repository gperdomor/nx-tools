// TODO: Add tests for this file
import { config } from 'dotenv';

export const loadEnvVars = (path?: string) => {
  if (path) {
    const result = config({ path });
    if (result.error) {
      throw result.error;
    }
  } else {
    try {
      config();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
};
