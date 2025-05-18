/**
 * This pre-install script will check that the necessary dependencies are installed
 * Checks for:
 *   - Node 20.19+
 */

if (process.env.CI) {
  process.exit(0);
}

import { consola } from 'consola';
import { lt as semverLessThan } from 'semver';

// Check node version
if (semverLessThan(process.version, '20.19.0')) {
  consola.error('Please make sure that your installed Node version is v20.19.0 or greater!');
  process.exit(1);
}
