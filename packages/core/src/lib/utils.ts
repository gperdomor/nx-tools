/**
 * Converts a value to a boolean with intelligent type handling.
 *
 * This function provides robust boolean conversion for various input types commonly
 * encountered in environment variables, configuration files, and user input.
 *
 * **Conversion Rules:**
 * - `boolean`: Returns as-is
 * - `string`: Case-insensitive comparison against truthy values ('true', '1', 'yes', 'on')
 * - `number`: Returns `false` for 0, `true` for all other numbers (including NaN)
 * - `null/undefined`: Returns `false`
 * - Other types: Uses JavaScript's built-in `Boolean()` conversion
 *
 * @param value - The value to convert to boolean. Can be of any type.
 * @returns {boolean} The boolean representation of the input value
 * @since 7.0.0
 *
 * @example
 * ```typescript
 * import { toBoolean } from './utils';
 *
 * // String conversions (case-insensitive)
 * toBoolean('true')     // true
 * toBoolean('TRUE')     // true
 * toBoolean('false')    // false
 * toBoolean('1')        // true
 * toBoolean('0')        // false
 * toBoolean('yes')      // true
 * toBoolean('no')       // false
 * toBoolean('on')       // true
 * toBoolean('off')      // false
 * toBoolean('  true  ') // true (whitespace trimmed)
 * toBoolean('invalid')  // false
 *
 * // Number conversions
 * toBoolean(1)          // true
 * toBoolean(0)          // false
 * toBoolean(-1)         // true
 * toBoolean(NaN)        // true
 *
 * // Other types
 * toBoolean(null)       // false
 * toBoolean(undefined)  // false
 * toBoolean([])         // true (truthy object)
 * toBoolean({})         // true (truthy object)
 * ```
 */
export function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return Boolean(value);
}
