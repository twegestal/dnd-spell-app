import { z } from 'zod';
import { supabaseAdmin } from '../database/index.js';
import { supabaseForRequest } from '../database/supabaseUser.js';
import { logger } from '../log/index.js';
import {
  SpellSchema,
  SpellListResponseSchema,
  CreateSpell,
  UpdateSpell,
} from '../types/spells.js';

export const fetchAllSpells = async () => {
  logger.info('Fetching all spells from database');

  const { data, error } = await supabaseAdmin
    .from('spell_full')
    .select('*')
    .eq('is_published', true)
    .order('name', { ascending: true });

  if (error) {
    logger.error('Failed to fetch spells', { message: error.message });
    throw error;
  }

  return SpellListResponseSchema.parse({
    results: z.array(SpellSchema).parse(data ?? []),
  });
};

export const fetchHomebrewSpells = async (authHeader: string) => {
  logger.info('Fetching homebrew spells for user');

  const client = supabaseForRequest(authHeader);
  const { data, error } = await client
    .from('spell_full')
    .select('*')
    .eq('is_homebrew', true)
    .order('name', { ascending: true });

  if (error) {
    logger.error('Failed to fetch homebrew spells', { message: error.message });
    throw error;
  }

  return SpellListResponseSchema.parse({
    results: z.array(SpellSchema).parse(data ?? []),
  });
};

export const createHomebrewSpell = async (
  authHeader: string,
  userId: string,
  input: CreateSpell,
) => {
  logger.info('Creating homebrew spell');

  const { class_ids, ...spellData } = input;
  const client = supabaseForRequest(authHeader);

  const { data, error } = await client
    .from('spells')
    .insert({
      ...spellData,
      is_homebrew: true,
      is_published: false,
      created_by: userId,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to create homebrew spell', { message: error.message });
    throw error;
  }

  if (class_ids?.length) {
    const { error: classError } = await client
      .from('spell_classes')
      .insert(class_ids.map((class_id) => ({ spell_id: data.id, class_id })));

    if (classError) {
      logger.error('Failed to insert spell classes', {
        message: classError.message,
      });
      throw classError;
    }
  }

  const { data: full, error: fullError } = await client
    .from('spell_full')
    .select('*')
    .eq('id', data.id)
    .single();

  if (fullError) {
    logger.error('Failed to fetch created spell', {
      message: fullError.message,
    });
    throw fullError;
  }

  return SpellSchema.parse(full);
};

export const updateHomebrewSpell = async (
  authHeader: string,
  id: string,
  input: UpdateSpell,
) => {
  logger.info('Updating homebrew spell', { id });

  const { class_ids, ...spellData } = input;
  const client = supabaseForRequest(authHeader);

  const { error } = await client
    .from('spells')
    .update({ ...spellData, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    logger.error('Failed to update homebrew spell', { message: error.message });
    throw error;
  }

  if (class_ids !== undefined) {
    const { error: deleteError } = await client
      .from('spell_classes')
      .delete()
      .eq('spell_id', id);

    if (deleteError) throw deleteError;

    if (class_ids.length) {
      const { error: insertError } = await client
        .from('spell_classes')
        .insert(class_ids.map((class_id) => ({ spell_id: id, class_id })));

      if (insertError) throw insertError;
    }
  }

  const { data: full, error: fullError } = await client
    .from('spell_full')
    .select('*')
    .eq('id', id)
    .single();

  if (fullError) {
    logger.error('Failed to fetch updated spell', {
      message: fullError.message,
    });
    throw fullError;
  }

  return SpellSchema.parse(full);
};

export const togglePublishSpell = async (authHeader: string, id: string) => {
  logger.info('Toggling publish state for spell', { id });

  const client = supabaseForRequest(authHeader);

  const { data: current, error: fetchError } = await client
    .from('spells')
    .select('is_published')
    .eq('id', id)
    .single();

  if (fetchError) {
    logger.error('Failed to fetch spell for publish toggle', {
      message: fetchError.message,
    });
    throw fetchError;
  }

  const { error } = await client
    .from('spells')
    .update({ is_published: !current.is_published })
    .eq('id', id);

  if (error) {
    logger.error('Failed to toggle publish state', { message: error.message });
    throw error;
  }

  const { data: full, error: fullError } = await client
    .from('spell_full')
    .select('*')
    .eq('id', id)
    .single();

  if (fullError) {
    logger.error('Failed to fetch spell after publish toggle', {
      message: fullError.message,
    });
    throw fullError;
  }

  return SpellSchema.parse(full);
};

export const deleteHomebrewSpell = async (authHeader: string, id: string) => {
  logger.info('Deleting homebrew spell', { id });

  const client = supabaseForRequest(authHeader);
  const { error } = await client.from('spells').delete().eq('id', id);

  if (error) {
    logger.error('Failed to delete homebrew spell', { message: error.message });
    throw error;
  }
};
