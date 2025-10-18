import { supabase, supabaseAdmin } from '../database/index.js';
import { logger } from '../log/index.js';
import type { CharacterCreation, CharacterRow } from '../types/character.js';

function throwIf(error: unknown, ctx: string): void {
  if (!error) return;
  logger.error(`${ctx} error`, error);
  const e = error as any;
  if (e?.code === '23505') {
    throw new Error('A character with this name already exists.');
  }
  throw new Error(`${ctx} failed`);
}

function assertSb<T>(data: T | null, error: any, ctx: string): T {
  if (error) {
    logger.error(`${ctx} error`, error);
    throw new Error(`${ctx} failed`);
  }

  return (data ?? []) as T;
}

export async function listCharactersByUser(
  userId: string,
): Promise<CharacterRow[]> {
  const { data, error } = await supabaseAdmin
    .from('characters')
    .select('id, user_id, name, race, class, level, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  logger.info(`Data returned from query: ${data}`);

  return assertSb<CharacterRow[]>(data, error, 'listCharactersByUser');
}

export async function createCharacterForUser(
  userId: string,
  dto: CharacterCreation,
): Promise<CharacterRow> {
  const { data, error } = await supabaseAdmin
    .from('characters')
    .insert({
      user_id: userId,
      name: dto.name,
      race: dto.race,
      class: dto.class,
      level: dto.level,
    })
    .select('id, user_id, name, race, class, level, created_at, updated_at')
    .single();

  throwIf(error, 'createCharacterForUser');
  return data as CharacterRow;
}
