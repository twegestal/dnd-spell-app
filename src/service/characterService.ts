import { supabaseAdmin } from '../database/index.js';
import type {
  CharacterCreation,
  CharacterRow,
  CharacterWithJoins,
} from '../types/character.js';
import {
  PG_UNIQUE_VIOLATION,
  relationName,
  sbAssert,
  sbThrow,
} from '../util/supabaseHelpers.js';

const CHARACTER_SELECT = `
  id,
  user_id,
  name,
  level,
  created_at,
  updated_at,
  character_races ( name ),
  character_classes ( name )
`;

export async function listCharactersByUser(
  userId: string,
): Promise<CharacterRow[]> {
  const { data, error } = await supabaseAdmin
    .from('characters')
    .select(CHARACTER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const rows = sbAssert<any[]>(data, error, 'listCharactersByUser');

  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    name: r.name,
    race: relationName(r, 'character_races'),
    class: relationName(r, 'character_classes'),
    level: r.level,
    created_at: r.created_at,
    updated_at: r.updated_at,
  })) as CharacterRow[];
}

export async function createCharacterForUser(
  userId: string,
  dto: CharacterCreation,
): Promise<CharacterRow> {
  const { data: race, error: raceErr } = await supabaseAdmin
    .from('character_races')
    .select('id')
    .eq('name', dto.race)
    .single();
  sbAssert(race, raceErr, 'lookupRace');

  const { data: cls, error: clsErr } = await supabaseAdmin
    .from('character_classes')
    .select('id')
    .eq('name', dto.class)
    .single();
  sbAssert(cls, clsErr, 'lookupClass');

  const { data, error } = await supabaseAdmin
    .from('characters')
    .insert({
      user_id: userId,
      name: dto.name,
      race_id: race!.id,
      class_id: cls!.id,
      level: dto.level,
    })
    .select(CHARACTER_SELECT)
    .single();

  if (error) {
    sbThrow(error, 'createCharacterForUser', {
      [PG_UNIQUE_VIOLATION]: 'A character with this name already exists.',
    });
  }

  const d = data as CharacterWithJoins;
  return {
    id: d.id,
    user_id: d.user_id,
    name: d.name,
    race: relationName(d, 'character_races'),
    class: relationName(d, 'character_classes'),
    level: d.level,
    created_at: d.created_at,
    updated_at: d.updated_at,
  } as CharacterRow;
}

export async function updateCharacterLevel(
  id: string,
  userId: string,
  level: number,
): Promise<CharacterRow> {
  const { data: existing, error: existErr } = await supabaseAdmin
    .from('characters')
    .select('id, user_id')
    .eq('id', id)
    .single();

  const row = sbAssert<{ id: string; user_id: string } | null>(
    existing,
    existErr,
    'updateCharacterLevel:load',
  );

  if (!row) {
    const err: any = new Error('Character not found');
    err.statusCode = 404;
    throw err;
  }
  if (row.user_id !== userId) {
    const err: any = new Error('Not allowed');
    err.statusCode = 403;
    throw err;
  }

  const { data, error } = await supabaseAdmin
    .from('characters')
    .update({ level })
    .eq('id', id)
    .select(CHARACTER_SELECT)
    .single();

  const updated = sbAssert<CharacterWithJoins>(
    data,
    error,
    'updateCharacterLevel:update',
  );

  return {
    id: updated.id,
    user_id: updated.user_id,
    name: updated.name,
    race: relationName(updated, 'character_races'),
    class: relationName(updated, 'character_classes'),
    level: updated.level,
    created_at: updated.created_at,
    updated_at: updated.updated_at,
  };
}
