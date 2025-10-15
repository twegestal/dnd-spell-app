export const removeDuplicates = <T>(array: T[]): T[] =>
  Array.from(new Set(array));

export const flattenArray = <T>(array: T[][]): T[] =>
  array.reduce((acc, val) => acc.concat(val), []);

export const chunkArray = <T>(array: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size),
  );
