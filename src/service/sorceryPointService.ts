import { supabaseForRequest } from '../database/supabaseUser.js';

export async function getSorceryPoints(
  authHeader: string | undefined,
  characterId: string,
) {
  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_sorcery_points_remaining', {
    p_character: characterId,
  });
  if (error) throw new Error(`fetch_sorcery_points failed: ${error.message}`);

  const row = Array.isArray(data) ? data[0] : data;
  return {
    characterId,
    remaining: row?.remaining ?? 0,
    maximum: row?.maximum ?? 0,
  };
}

export async function spendSorceryPoints(
  authHeader: string | undefined,
  characterId: string,
  qty: number,
) {
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error('qty must be a positive integer');
  }

  const sb = supabaseForRequest(authHeader);
  const { data, error } = await sb.rpc('character_spend_sorcery_points', {
    p_character: characterId,
    p_qty: qty,
  });

  if (error) {
    throw new Error(`spend_sorcery_points failed: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    characterId,
    spent: qty,
    remaining: row?.remaining ?? null,
    maximum: row?.maximum ?? null,
  };
}
