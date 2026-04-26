import { z } from 'zod';

export const SpellSchema = z.object({
  id: z.string().uuid(),
  idx: z.string(),
  name: z.string(),
  level: z.number(),

  casting_time: z.string(),
  range: z.string(),
  duration: z.string(),

  concentration: z.boolean(),
  ritual: z.boolean(),
  attack_type: z.enum(['melee', 'ranged']).nullable(),

  components: z.array(z.enum(['V', 'S', 'M'])),
  material: z.string().nullable(),

  school_id: z.number(),
  school_idx: z.string().nullable(),
  school_name: z.string().nullable(),

  damage_type_id: z.number().nullable(),
  damage_type_idx: z.string().nullable(),
  damage_type_name: z.string().nullable(),

  dc_type: z.enum(['str', 'dex', 'con', 'int', 'wis', 'cha']).nullable(),
  dc_success: z.enum(['none', 'half', 'other']).nullable(),
  dc_desc: z.string().nullable(),

  aoe_type: z.enum(['sphere', 'cube', 'cone', 'cylinder', 'line']).nullable(),
  aoe_size: z.number().nullable(),

  description: z.array(z.string()),
  higher_level: z.array(z.string()),

  is_homebrew: z.boolean(),
  created_by: z.string().uuid().nullable(),
  is_published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),

  class_names: z.array(z.string()).nullable(),
  class_ids: z.array(z.number()).nullable(),
  subclass_names: z.array(z.string()).nullable(),
});

export const SpellListResponseSchema = z.object({
  results: z.array(SpellSchema),
});

export const CreateSpellSchema = z.object({
  name: z.string().min(1),
  level: z.number().int().min(0).max(9),
  casting_time: z.string().min(1),
  range: z.string().min(1),
  duration: z.string().min(1),
  concentration: z.boolean().default(false),
  ritual: z.boolean().default(false),
  attack_type: z.enum(['melee', 'ranged']).nullable().default(null),
  components: z.array(z.enum(['V', 'S', 'M'])).default([]),
  material: z.string().nullable().default(null),
  school_id: z.number().int(),
  damage_type_id: z.number().int().nullable().default(null),
  dc_type: z
    .enum(['str', 'dex', 'con', 'int', 'wis', 'cha'])
    .nullable()
    .default(null),
  dc_success: z.enum(['none', 'half', 'other']).nullable().default(null),
  dc_desc: z.string().nullable().default(null),
  aoe_type: z
    .enum(['sphere', 'cube', 'cone', 'cylinder', 'line'])
    .nullable()
    .default(null),
  aoe_size: z.number().int().nullable().default(null),
  description: z.array(z.string()).default([]),
  higher_level: z.array(z.string()).default([]),
  class_ids: z.array(z.number().int()).default([]),
});

export const UpdateSpellSchema = CreateSpellSchema.partial();

export type Spell = z.infer<typeof SpellSchema>;
export type SpellListResponse = z.infer<typeof SpellListResponseSchema>;
export type CreateSpell = z.infer<typeof CreateSpellSchema>;
export type UpdateSpell = z.infer<typeof UpdateSpellSchema>;
