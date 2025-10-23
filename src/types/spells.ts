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
  created_at: z.string(),
  updated_at: z.string(),

  class_names: z.array(z.string()).nullable(),
  subclass_names: z.array(z.string()).nullable(),
});

export const SpellListResponseSchema = z.object({
  results: z.array(SpellSchema),
});

export type Spell = z.infer<typeof SpellSchema>;
export type SpellListResponse = z.infer<typeof SpellListResponseSchema>;
