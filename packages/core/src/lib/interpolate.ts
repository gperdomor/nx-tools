/**
 * Insert variables directly in the string.
 * @param string String to interpolate.
 * @returns Interpolated string.
 */
export const interpolate = (string: string): string => {
  const replaced = string.replace(/\${?([a-zA-Z0-9_]+)?}?/g, (m1, g1) => {
    return process.env[g1] || m1;
  });
  return replaced;
};
