import { z } from 'zod';

export type CharacterClass = {
  name: string;
  level: number;
};

export type CharacterWithJoins = {
  id: string;
  user_id: string;
  name: string;
  level: number;
  created_at: string;
  updated_at: string;
  character_races?: { name: string }[] | null;
  character_classes?: { name: string }[] | null;
  character_class_levels?:
    | { level: number; character_classes: { name: string } | null }[]
    | null;
};

export type CharacterRow = {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  classes: CharacterClass[];
  level: number;
  is_retired: boolean;
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

export const CharacterLevelUpdateSchema = z.object({
  level: z.number().int().min(1).max(20),
});

export const AddCharacterClassSchema = z.object({
  class: z.string().min(1, 'Class is required').max(100),
  level: z.number().int().min(1).max(20),
});

export const UpdateCharacterClassSchema = z.object({
  level: z.number().int().min(1).max(20),
});

export type CharacterLevelUpdate = z.infer<typeof CharacterLevelUpdateSchema>;
export type AssignKnownSpell = z.infer<typeof AssignKnownSpellSchema>;
export type CharacterCreation = z.infer<typeof CharacterCreationSchema>;
export type AddCharacterClass = z.infer<typeof AddCharacterClassSchema>;
export type UpdateCharacterClass = z.infer<typeof UpdateCharacterClassSchema>;
