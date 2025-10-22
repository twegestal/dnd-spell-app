import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseForRequest } from '../database/supabaseUser.js';

export type ToggleSlotArgs = {
  characterId: string;
  slotLevel: number;
  slotIndex: number;
  spellId?: string | null;
  note?: string | null;
};

export async function toggleSlot(
  authHeader: string | undefined,
  {
    characterId,
    slotLevel,
    slotIndex,
    spellId = null,
    note = null,
  }: ToggleSlotArgs,
) {
  const sb: SupabaseClient = supabaseForRequest(authHeader);

  const { data, error } = await sb.rpc('toggle_slot', {
    p_character: characterId,
    p_slot_level: slotLevel,
    p_slot_index: slotIndex,
    p_spell_id: spellId,
    p_note: note,
  });

  if (error) {
    throw new Error(`toggle_slot failed: ${error.message}`);
  }

  const spent = Array.isArray(data) && data.length ? !!data[0].spent : null;
  return { characterId, slotLevel, slotIndex, spent };
}

export type PreparedLevel = {
  slotLevel: number;
  remaining: number;
  maximum: number;
};

export async function getRemainingSlots(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);

  const { data: pactRows, error: pactErr } = await sb
    .from('v_character_pact_remaining')
    .select('slot_level, remaining, maximum')
    .eq('character_id', characterId)
    .limit(1);

  if (pactErr)
    throw new Error(`getRemainingSlots pact failed: ${pactErr.message}`);

  if (pactRows && pactRows.length) {
    const row = pactRows[0];
    return {
      type: 'pact' as const,
      slotLevel: row.slot_level as number,
      remaining: row.remaining as number,
      maximum: row.maximum as number,
    };
  }

  const { data: prepRows, error: prepErr } = await sb
    .from('v_character_slots_remaining')
    .select('slot_level, remaining, maximum')
    .eq('character_id', characterId)
    .order('slot_level', { ascending: true });

  if (prepErr)
    throw new Error(`getRemainingSlots prepared failed: ${prepErr.message}`);

  const levels: PreparedLevel[] = (prepRows ?? []).map((r) => ({
    slotLevel: r.slot_level as number,
    remaining: r.remaining as number,
    maximum: r.maximum as number,
  }));

  return { type: 'prepared' as const, levels };
}

export async function longRest(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { error } = await sb.rpc('character_long_rest', {
    p_character: characterId,
  });
  if (error) throw new Error(`long_rest failed: ${error.message}`);
  return { ok: true };
}

export async function shortRest(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { error } = await sb.rpc('character_short_rest', {
    p_character: characterId,
  });
  if (error) throw new Error(`short_rest failed: ${error.message}`);
  return { ok: true };
}
