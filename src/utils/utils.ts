export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const generateUUID = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const deepMerge = <T extends object, U extends object>(
  target: T,
  source: U,
): T & U => {
  const isObject = (obj: any): obj is object => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source as T & U;
  }

  Object.keys(source).forEach((key) => {
    if (isObject((source as any)[key])) {
      if (!(target as any)[key]) {
        (target as any)[key] = {};
      }
      deepMerge((target as any)[key], (source as any)[key]);
    } else {
      (target as any)[key] = (source as any)[key];
    }
  });

  return target as T & U;
};

export const randomInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isEmptyObject = (obj: Record<string, any>): boolean =>
  Object.keys(obj).length === 0;

export const safeJSONParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};
