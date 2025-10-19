import { logger } from '../log/index.js';
import type { SbError } from '../types/error.js';

export const PG_UNIQUE_VIOLATION = '23505';

export function sbThrow(
  error: SbError,
  ctx: string,
  friendly: Record<string, string> = {},
): never {
  if (!error) throw new Error(`${ctx} failed`);
  logger.error(`${ctx} error`, error);
  const code = (error as any)?.code;
  if (code && friendly[code]) throw new Error(friendly[code]);
  throw new Error(`${ctx} failed`);
}

export function sbAssert<T>(data: T | null, error: SbError, ctx: string): T {
  if (error) sbThrow(error, ctx);
  return (data ?? (Array.isArray(data) ? [] : null)) as T;
}

export function relationName(row: any, key: string): string | null {
  const rel = row?.[key];
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0]?.name ?? null;
  return rel?.name ?? null;
}
