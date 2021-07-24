/**
 * Iterate an array in an asynchronous way
 * @param array The array to iterate
 * @param callback Callback
 */
export const asyncForEach = async <T>(array: T[], callback: (value: T, i: number, arr: T[]) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
