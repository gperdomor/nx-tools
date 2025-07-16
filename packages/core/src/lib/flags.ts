import { env, isDebug as stdIsDebug } from 'std-env';
import { toBoolean } from './utils';

/**
 * Detect if debugging is enabled by checking `DEBUG` or `RUNNER_DEBUG` environment variables.
 *
 * This flag is useful for enabling verbose logging and debugging output in applications.
 * It combines Node.js standard debug detection with GitHub Actions runner debug mode.
 *
 * @returns {boolean} `true` if debugging is enabled, `false` otherwise
 * @since 7.0.0
 *
 * @example
 * ```typescript
 * import { isDebug } from './flags';
 *
 * if (isDebug) {
 *   console.log('Debug mode enabled');
 * }
 * ```
 */
export const isDebug = stdIsDebug || toBoolean(env.RUNNER_DEBUG);
