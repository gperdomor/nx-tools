import { deploySuite } from './src/executors/deploy/executor.spec';
import { generateSuite } from './src/executors/generate/executor.spec';
import { migrateSuite } from './src/executors/migrate/executor.spec';
import { pullSuite } from './src/executors/pull/executor.spec';
import { pushSuite } from './src/executors/push/executor.spec';
import { resetSuite } from './src/executors/reset/executor.spec';
import { seedSuite } from './src/executors/seed/executor.spec';
import { statusSuite } from './src/executors/status/executor.spec';

describe('Run Test', () => {
  migrateSuite();
  statusSuite();
  generateSuite();
  pushSuite();
  pullSuite();
  resetSuite();
  seedSuite();
  deploySuite();
});
