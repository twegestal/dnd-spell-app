import { supabaseAdmin } from '../database/index.js';
import {
  PG_UNIQUE_VIOLATION,
  sbAssert,
  sbThrow,
} from '../util/supabaseHelpers.js';

export async function addKnownSpell(characterId: string, spellId: string) {
  const { data, error } = await supabaseAdmin
    .from('character_known_spells')
    .upsert(
      { character_id: characterId, spell_id: spellId },
      { onConflict: 'character_id,spell_id' },
    )
    .select('character_id, spell_id, added_at')
    .single();

  if (error && (error as any)?.code === PG_UNIQUE_VIOLATION) {
    return {
      character_id: characterId,
      spell_id: spellId,
      added_at: new Date().toISOString(),
    };
  }

  return sbAssert(data, error, 'addKnownSpell');
}

export async function removeKnownSpell(characterId: string, spellId: string) {
  const { error } = await supabaseAdmin
    .from('character_known_spells')
    .delete()
    .eq('character_id', characterId)
    .eq('spell_id', spellId);

  if (error) sbThrow(error, 'removeKnownSpell');
  return { ok: true as const };
}

export async function listKnownSpells(characterId: string) {
  const { data: rows, error: e1 } = await supabaseAdmin
    .from('character_known_spells')
    .select('spell_id')
    .eq('character_id', characterId);

  if (e1) sbThrow(e1, 'listKnownSpells.ids');

  const ids = (rows ?? []).map((r: any) => r.spell_id);
  if (ids.length === 0) return [];

  const { data: spells, error: e2 } = await supabaseAdmin
    .from('spell_full')
    .select('*')
    .in('id', ids)
    .order('name', { ascending: true });

  if (e2) sbThrow(e2, 'listKnownSpells.spells');

  return spells ?? [];
}

export async function addPreparedSpell(characterId: string, spellId: string) {
  const { data, error } = await supabaseAdmin
    .from('character_prepared_spells')
    .upsert(
      { character_id: characterId, spell_id: spellId },
      { onConflict: 'character_id,spell_id' },
    )
    .select('character_id, spell_id, prepared_at')
    .single();

  if (error && (error as any)?.code === PG_UNIQUE_VIOLATION) {
    return {
      character_id: characterId,
      spell_id: spellId,
      prepared_at: new Date().toISOString(),
    };
  }

  return sbAssert(data, error, 'addPreparedSpell');
}

export async function removePreparedSpell(
  characterId: string,
  spellId: string,
) {
  const { error } = await supabaseAdmin
    .from('character_prepared_spells')
    .delete()
    .eq('character_id', characterId)
    .eq('spell_id', spellId);

  if (error) sbThrow(error, 'removePreparedSpell');
  return { ok: true as const };
}

export async function listPreparedSpells(characterId: string) {
  const { data: rows, error: e1 } = await supabaseAdmin
    .from('character_prepared_spells')
    .select('spell_id')
    .eq('character_id', characterId);

  if (e1) sbThrow(e1, 'listPreparedSpells.ids');

  const ids = (rows ?? []).map((r: any) => r.spell_id);
  if (ids.length === 0) return [];

  const { data: spells, error: e2 } = await supabaseAdmin
    .from('spell_full')
    .select('*')
    .in('id', ids)
    .order('name', { ascending: true });

  if (e2) sbThrow(e2, 'listPreparedSpells.spells');

  return spells ?? [];
}
