import { supabaseAdmin } from '../database/index.js';
import type {
  CharacterCreation,
  CharacterRow,
  AddCharacterClass,
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
  is_retired,
  created_at,
  updated_at,
  character_races ( name ),
  character_classes!characters_class_id_fkey ( name ),
  character_class_levels (
    level,
    character_classes ( id, name )
  )
`;

function mapCharacterRow(r: any): CharacterRow {
  const primaryClass = relationName(r, 'character_classes') ?? '';

  const classes = (r.character_class_levels ?? []).map((ccl: any) => ({
    id: ccl.character_classes?.id ?? 0,
    name: ccl.character_classes?.name ?? '',
    level: ccl.level,
  }));

  const resolvedClasses =
    classes.length > 0
      ? classes
      : primaryClass
        ? [{ name: primaryClass, level: r.level }]
        : [];

  return {
    id: r.id,
    user_id: r.user_id,
    name: r.name,
    race: relationName(r, 'character_races') ?? '',
    class: primaryClass,
    classes: resolvedClasses,
    level: r.level,
    is_retired: r.is_retired,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function listCharactersByUser(
  userId: string,
): Promise<CharacterRow[]> {
  const { data, error } = await supabaseAdmin
    .from('characters')
    .select(CHARACTER_SELECT)
    .eq('user_id', userId)
    .eq('is_retired', false)
    .order('created_at', { ascending: false });

  const rows = sbAssert<any[]>(data, error, 'listCharactersByUser');
  return rows.map(mapCharacterRow);
}

export async function retireCharacter(
  id: string,
  userId: string,
): Promise<CharacterRow> {
  const { data: existing, error: existErr } = await supabaseAdmin
    .from('characters')
    .select('id, user_id')
    .eq('id', id)
    .single();

  const row = sbAssert<{ id: string; user_id: string } | null>(
    existing,
    existErr,
    'retireCharacter:load',
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
    .update({ is_retired: true })
    .eq('id', id)
    .select(CHARACTER_SELECT)
    .single();

  const updated = sbAssert<any>(data, error, 'retireCharacter:update');
  return mapCharacterRow(updated);
}

export async function restoreCharacter(
  id: string,
  userId: string,
): Promise<CharacterRow> {
  const { data: existing, error: existErr } = await supabaseAdmin
    .from('characters')
    .select('id, user_id')
    .eq('id', id)
    .single();

  const row = sbAssert<{ id: string; user_id: string } | null>(
    existing,
    existErr,
    'restoreCharacter:load',
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
    .update({ is_retired: false })
    .eq('id', id)
    .select(CHARACTER_SELECT)
    .single();

  const updated = sbAssert<any>(data, error, 'restoreCharacter:update');
  return mapCharacterRow(updated);
}

export async function listAllCharactersByUser(
  userId: string,
): Promise<CharacterRow[]> {
  const { data, error } = await supabaseAdmin
    .from('characters')
    .select(CHARACTER_SELECT)
    .eq('user_id', userId)
    .order('is_retired', { ascending: true })
    .order('created_at', { ascending: false });

  const rows = sbAssert<any[]>(data, error, 'listAllCharactersByUser');
  return rows.map(mapCharacterRow);
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

  return mapCharacterRow(data);
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

  const updated = sbAssert<any>(data, error, 'updateCharacterLevel:update');
  return mapCharacterRow(updated);
}

export async function addCharacterClass(
  id: string,
  userId: string,
  dto: AddCharacterClass,
): Promise<CharacterRow> {
  const { data: existing, error: existErr } = await supabaseAdmin
    .from('characters')
    .select('id, user_id')
    .eq('id', id)
    .single();

  const row = sbAssert<{ id: string; user_id: string } | null>(
    existing,
    existErr,
    'addCharacterClass:load',
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

  const { data: cls, error: clsErr } = await supabaseAdmin
    .from('character_classes')
    .select('id')
    .eq('name', dto.class)
    .single();
  sbAssert(cls, clsErr, 'addCharacterClass:lookupClass');

  const { error: insertErr } = await supabaseAdmin
    .from('character_class_levels')
    .insert({
      character_id: id,
      class_id: cls!.id,
      level: dto.level,
    });

  if (insertErr) {
    sbThrow(insertErr, 'addCharacterClass:insert', {
      [PG_UNIQUE_VIOLATION]: 'Character already has this class.',
    });
  }

  const { data: allLevels } = await supabaseAdmin
    .from('character_class_levels')
    .select('level')
    .eq('character_id', id);

  const totalLevel = (allLevels ?? []).reduce((sum, r) => sum + r.level, 0);

  const { data, error } = await supabaseAdmin
    .from('characters')
    .update({ level: totalLevel })
    .eq('id', id)
    .select(CHARACTER_SELECT)
    .single();

  const updated = sbAssert<any>(data, error, 'addCharacterClass:update');
  return mapCharacterRow(updated);
}

export async function updateCharacterClassLevel(
  id: string,
  userId: string,
  classId: number,
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
    'updateCharacterClassLevel:load',
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

  const { error: updateErr } = await supabaseAdmin
    .from('character_class_levels')
    .update({ level })
    .eq('character_id', id)
    .eq('class_id', classId);

  if (updateErr) sbThrow(updateErr, 'updateCharacterClassLevel:update');

  const { data: allLevels } = await supabaseAdmin
    .from('character_class_levels')
    .select('level')
    .eq('character_id', id);

  const totalLevel = (allLevels ?? []).reduce((sum, r) => sum + r.level, 0);

  const { data, error } = await supabaseAdmin
    .from('characters')
    .update({ level: totalLevel })
    .eq('id', id)
    .select(CHARACTER_SELECT)
    .single();

  const updated = sbAssert<any>(
    data,
    error,
    'updateCharacterClassLevel:update',
  );
  return mapCharacterRow(updated);
}

export async function removeCharacterClass(
  id: string,
  userId: string,
  classId: number,
): Promise<CharacterRow> {
  const { data: existing, error: existErr } = await supabaseAdmin
    .from('characters')
    .select('id, user_id')
    .eq('id', id)
    .single();

  const row = sbAssert<{ id: string; user_id: string } | null>(
    existing,
    existErr,
    'removeCharacterClass:load',
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

  const { data: currentClasses } = await supabaseAdmin
    .from('character_class_levels')
    .select('class_id')
    .eq('character_id', id);

  if ((currentClasses ?? []).length <= 1) {
    const err: any = new Error('Cannot remove the only class from a character');
    err.statusCode = 400;
    throw err;
  }

  const { error: deleteErr } = await supabaseAdmin
    .from('character_class_levels')
    .delete()
    .eq('character_id', id)
    .eq('class_id', classId);

  if (deleteErr) sbThrow(deleteErr, 'removeCharacterClass:delete');

  const { data: allLevels } = await supabaseAdmin
    .from('character_class_levels')
    .select('level')
    .eq('character_id', id);

  const totalLevel = (allLevels ?? []).reduce((sum, r) => sum + r.level, 0);

  const { data, error } = await supabaseAdmin
    .from('characters')
    .update({ level: totalLevel })
    .eq('id', id)
    .select(CHARACTER_SELECT)
    .single();

  const updated = sbAssert<any>(data, error, 'removeCharacterClass:delete');
  return mapCharacterRow(updated);
}
