// services/metaService.ts
import { MetaListResponseSchema } from '../schemas/metaSchemas.js';
import type { MetaListResponse } from '../types/meta.js';
import { logger } from '../log/index.js';

const API_BASE = 'https://www.dnd5eapi.co/api';

function assertOk(res: Response, context: string) {
  if (!res.ok) {
    logger.error(`${context} failed`, {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(`${context} failed: ${res.status} ${res.statusText}`);
  }
}

/**
 * Tiny in-memory cache (per-process). Good enough for dev/single instance.
 * For multi-instance, swap to Redis later.
 */
const cache = new Map<string, { data: MetaListResponse; expiresAt: number }>();
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

async function fetchMetaList(
  kind: 'races' | 'classes',
  { ttlMs = DEFAULT_TTL_MS }: { ttlMs?: number } = {},
): Promise<MetaListResponse> {
  const cacheKey = `meta:${kind}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    logger.debug(`meta ${kind}: served from cache`);
    return cached.data;
  }

  logger.info(`Fetching ${kind} from external API`);
  const res = await fetch(`${API_BASE}/${kind}`, {});
  assertOk(res, `Fetch ${kind}`);

  const json = await res.json();
  const parsed = MetaListResponseSchema.safeParse(json);

  if (!parsed.success) {
    logger.error(`Meta ${kind} validation error`, {
      issues: parsed.error.format(),
    });
    throw new Error(`Invalid ${kind} response shape`);
  }

  const data = parsed.data;
  cache.set(cacheKey, { data, expiresAt: now + ttlMs });

  logger.info(`Fetched and validated ${kind} successfully`, {
    count: data.count,
  });
  return data;
}

export async function fetchRaces(): Promise<MetaListResponse> {
  return fetchMetaList('races');
}

export async function fetchClasses(): Promise<MetaListResponse> {
  return fetchMetaList('classes');
}
