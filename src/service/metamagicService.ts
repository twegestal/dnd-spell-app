import { supabaseForRequest } from '../database/supabaseUser.js';

export async function listMetamagic(authHeader: string | undefined) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('metamagic_options_list');
  if (error) throw new Error(`list_metamagic failed: ${error.message}`);
  return data ?? [];
}

export async function useMetamagic(
  authHeader: string | undefined,
  characterId: string,
  optionIdx: string,
  times: number = 1,
  spellId?: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_use_metamagic', {
    p_character: characterId,
    p_option_idx: optionIdx,
    p_times: times,
    p_spell: spellId ?? null,
  });
  if (error) throw new Error(`use_metamagic failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return {
    characterId,
    optionIdx,
    times,
    spent: row?.spent ?? null,
    remaining: row?.remaining ?? null,
    maximum: row?.maximum ?? null,
  };
}

export async function listKnownMetamagic(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_metamagic_list', {
    p_character: characterId,
  });
  if (error) throw new Error(`list_known_metamagic failed: ${error.message}`);
  return data ?? [];
}

export async function addKnownMetamagic(
  authHeader: string | undefined,
  characterId: string,
  optionIdx: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_metamagic_add', {
    p_character: characterId,
    p_option_idx: optionIdx,
  });
  if (error) throw new Error(`add_known_metamagic failed: ${error.message}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteKnownMetamagic(
  authHeader: string | undefined,
  characterId: string,
  optionIdx: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { error } = await sb.rpc('character_metamagic_delete', {
    p_character: characterId,
    p_option_idx: optionIdx,
  });
  if (error) throw new Error(`delete_known_metamagic failed: ${error.message}`);
  return { ok: true };
}
