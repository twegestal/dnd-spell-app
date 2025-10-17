import {
  SpellListResponseSchema,
  SpellDetailSchema,
} from '../schemas/spellSchemas';
import type { SpellListResponse, SpellDetail } from '../types/spells';
import { logger } from '../log';

const BASE_URL = 'https://www.dnd5eapi.co/api/spells';

function assertOk(res: Response, context: string) {
  if (!res.ok) {
    logger.error(`${context} failed`, {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(`${context} failed: ${res.status} ${res.statusText}`);
  }
}

export async function fetchAllSpells(): Promise<SpellListResponse> {
  logger.info('Fetching all spells from external API');

  const res = await fetch(BASE_URL);
  assertOk(res, 'Fetch all spells');

  const json = await res.json();
  const parsed = SpellListResponseSchema.safeParse(json);

  if (!parsed.success) {
    logger.error('SpellListResponse validation error', {
      issues: parsed.error.format(),
    });
    throw new Error('Invalid spell list response shape');
  }

  logger.info('Fetched and validated spell list successfully', {
    count: parsed.data.count,
  });

  return parsed.data;
}

export async function fetchSpellByIndex(index: string): Promise<SpellDetail> {
  logger.info('Fetching spell details', { index });

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(index)}`);
  assertOk(res, `Fetch spell "${index}"`);

  const json = await res.json();
  const parsed = SpellDetailSchema.safeParse(json);

  if (!parsed.success) {
    logger.error('SpellDetail validation error', {
      index,
      issues: parsed.error.format(),
    });
    throw new Error(`Invalid spell detail response shape for index "${index}"`);
  }

  logger.info('Fetched and validated spell successfully', {
    index,
    name: parsed.data.name,
  });
  return parsed.data;
}
