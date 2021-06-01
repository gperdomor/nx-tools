import { getInput as acGetInput, InputOptions as acInputOptions } from '@actions/core';

/**
 * Interface for getInput options
 */
export interface InputOptions extends acInputOptions {
  fallback?: string;
}

//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------

/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
export function getInput(name: string, options?: InputOptions): string {
  let val: string;

  try {
    val = acGetInput(name, options);

    if (!val && options?.fallback) {
      val = options.fallback;
    }
  } catch (error) {
    val = options?.fallback || '';
  }

  if (options && options.required && !val) {
    throw new Error(`Input required and not supplied: ${name}`);
  }

  if (options && options.trimWhitespace === false) {
    return val;
  }

  return val.trim();
}

/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
export function getBooleanInput(name: string, options?: InputOptions): boolean {
  const trueValue = ['true', 'True', 'TRUE'];
  const falseValue = ['false', 'False', 'FALSE'];
  const val = getInput(name, options);
  if (trueValue.includes(val)) return true;
  if (falseValue.includes(val)) return false;
  throw new TypeError(
    `Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
      `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``,
  );
}

//-----------------------------------------------------------------------
// Utils Commands
//-----------------------------------------------------------------------

export const asyncForEach = async <T>(array: T[], callback: (value: T, i: number, arr: T[]) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const interpolate = (str: string) => {
  const replaced = str.replace(/\${?([a-zA-Z0-9_]+)?}?/g, (m1, g1) => {
    return process.env[g1] || m1;
  });
  return replaced;
};
