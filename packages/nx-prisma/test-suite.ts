import { generateSuite } from './src/executors/generate/executor.spec';
import { migrationsSuite } from './src/executors/migrations/executor.spec';
import { resetSuite } from './src/executors/reset/executor.spec';
import { seedSuite } from './src/executors/seed/executor.spec';

describe('Run Test', () => {
  migrationsSuite();
  generateSuite();
  seedSuite();
  resetSuite();
});
