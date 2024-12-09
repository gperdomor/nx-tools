/**
 * This pre-install script will check that the necessary dependencies are installed
 * Checks for:
 *   - Node 20+
 */

if (process.env.CI) {
  process.exit(0);
}

import { lt as semverLessThan } from 'semver';

// Check node version
if (semverLessThan(process.version, '18.12.0')) {
  console.error('Please make sure that your installed Node version is greater than v20');
  process.exit(1);
}
