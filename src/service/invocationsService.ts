import { supabaseForRequest } from '../database/supabaseUser.js';

export async function listInvocations(authHeader: string | undefined) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('invocations_list');
  if (error) throw new Error(`list_invocations failed: ${error.message}`);
  return data ?? [];
}

export async function listKnownInvocations(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_invocations_list', {
    p_character: characterId,
  });
  if (error) throw new Error(`list_known_invocations failed: ${error.message}`);
  return data ?? [];
}

export async function addKnownInvocation(
  authHeader: string | undefined,
  characterId: string,
  optionIdx: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_invocations_add', {
    p_character: characterId,
    p_option_idx: optionIdx,
  });
  if (error) throw new Error(`add_known_invocation failed: ${error.message}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function deleteKnownInvocation(
  authHeader: string | undefined,
  characterId: string,
  optionIdx: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { error } = await sb.rpc('character_invocations_delete', {
    p_character: characterId,
    p_option_idx: optionIdx,
  });
  if (error)
    throw new Error(`delete_known_invocation failed: ${error.message}`);
  return { ok: true };
}
