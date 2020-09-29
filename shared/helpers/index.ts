// For simple use case of checking array with primitive values
export const isArrayEqual = <T extends number | string>(a: T[], b: T[]) => {
  return sortAndStringify(a) === sortAndStringify(b);
};

export const sortAndStringify = <T extends number | string>(
  arr: T[]
): string => {
  // make sure to make a copy of an array because
  // sort() mutates the original array
  return [...arr].sort().toString();
};
