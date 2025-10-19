import { supabaseAdmin } from '../database/index.js';
import { logger } from '../log/index.js';
import { SpellListResponse, SpellListResponseSchema } from '../types/spells.js';

export const fetchAllSpells = async (): Promise<SpellListResponse> => {
  logger.info('Fetching all spells from database');

  const { data, error } = await supabaseAdmin
    .from('spells')
    .select('raw')
    .order('name', { ascending: true });

  if (error) {
    logger.error('Failed to fetch spells', { message: error.message });
    throw error;
  }

  const spells = (data ?? []).map((r: any) => r.raw);

  const parsed = SpellListResponseSchema.parse({
    count: spells.length,
    results: spells,
  });

  return parsed;
};
