import { z } from 'zod';

export type CharacterWithJoins = {
  id: string;
  user_id: string;
  name: string;
  level: number;
  created_at: string;
  updated_at: string;
  character_races?: { name: string }[] | null;
  character_classes?: { name: string }[] | null;
};

export type CharacterRow = {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  created_at: string;
  updated_at: string;
};

export const CharacterCreationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  race: z.string().min(1, 'Race is required').max(100),
  class: z.string().min(1, 'Class is required').max(100),
  level: z.number().int().min(1).max(20),
});

export const AssignKnownSpellSchema = z.object({
  spellId: z.string().min(1),
});

export type AssignKnownSpell = z.infer<typeof AssignKnownSpellSchema>;
export type CharacterCreation = z.infer<typeof CharacterCreationSchema>;
