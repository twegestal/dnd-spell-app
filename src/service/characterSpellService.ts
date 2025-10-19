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
