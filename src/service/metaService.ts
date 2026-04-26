import { MetaListResponse, MetaListResponseSchema } from '../types/meta.js';
import { logger } from '../log/index.js';
import { supabaseAdmin } from '../database/index.js';

async function fetchMeta(
  table:
    | 'character_races'
    | 'character_classes'
    | 'schools'
    | 'damage_types'
    | 'classes',
): Promise<MetaListResponse> {
  logger.info(`Fetching ${table} from database`);
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    logger.error(`Failed to fetch ${table}`, { message: error.message });
    throw error;
  }

  const results = (data ?? []).map((row: any) => ({
    id: String(row.id),
    name: row.name as string,
  }));

  return MetaListResponseSchema.parse({ count: results.length, results });
}

export async function fetchRaces(): Promise<MetaListResponse> {
  return fetchMeta('character_races');
}

export async function fetchClasses(): Promise<MetaListResponse> {
  return fetchMeta('character_classes');
}

export async function fetchSchools(): Promise<MetaListResponse> {
  return fetchMeta('schools');
}

export async function fetchDamageTypes(): Promise<MetaListResponse> {
  return fetchMeta('damage_types');
}

export async function fetchSpellClasses(): Promise<MetaListResponse> {
  return fetchMeta('classes');
}
