import { z } from 'zod';
import { supabaseAdmin } from '../database/index.js';
import { logger } from '../log/index.js';
import { SpellSchema, SpellListResponseSchema } from '../types/spells.js';

export const fetchAllSpells = async () => {
  logger.info('Fetching all spells from database');

  const { data, error } = await supabaseAdmin
    .from('spell_full')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    logger.error('Failed to fetch spells', { message: error.message });
    throw error;
  }

  const spells = z.array(SpellSchema).parse(data ?? []);

  const parsed = SpellListResponseSchema.parse({ results: spells });
  return parsed;
};
