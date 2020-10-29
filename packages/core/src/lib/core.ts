/**
 * Interface for getInput options
 */
export interface InputOptions {
  /** Optional. Whether the input is required. If required and not present, will throw. Defaults to false */
  required?: boolean;
}

/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
export const getInput = (name: string, options?: InputOptions): string => {
  const val: string = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
  if (options && options.required && !val) {
    throw new Error(`Input required and not supplied: ${name}`);
  }

  return val.trim();
};
