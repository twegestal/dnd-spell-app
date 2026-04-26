import { supabaseForRequest } from '../database/supabaseUser.js';

export async function listResources(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_resources_list', {
    p_character: characterId,
  });
  if (error) throw new Error(`list_resources failed: ${error.message}`);
  return data ?? [];
}

export async function setResource(
  authHeader: string | undefined,
  characterId: string,
  key: string,
  maximum: number,
  resetsOn: 'long' | 'short' = 'long',
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_resource_set', {
    p_character: characterId,
    p_key: key,
    p_maximum: maximum,
    p_resets_on: resetsOn,
  });
  if (error) throw new Error(`set_resource failed: ${error.message}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function spendResource(
  authHeader: string | undefined,
  characterId: string,
  key: string,
  qty: number = 1,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_resource_spend', {
    p_character: characterId,
    p_key: key,
    p_qty: qty,
  });
  if (error) throw new Error(`spend_resource failed: ${error.message}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function restoreResource(
  authHeader: string | undefined,
  characterId: string,
  key: string,
  qty?: number,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_resource_restore', {
    p_character: characterId,
    p_key: key,
    p_qty: qty ?? null,
  });
  if (error) throw new Error(`restore_resource failed: ${error.message}`);
  return Array.isArray(data) ? data[0] : data;
}
