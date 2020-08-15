export const loadEnvVars = (path?: string) => {
  if (path) {
    const result = require('dotenv').config({ path });
    if (result.error) {
      throw result.error;
    }
  } else {
    try {
      require('dotenv').config();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
};
