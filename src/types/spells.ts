import { z } from 'zod';

const NameUrlSchema = z.object({
  index: z.string(),
  name: z.string(),
  url: z.string(),
});

export const SpellSchema = z.object({
  index: z.string(),
  name: z.string(),
  level: z.number(),
  desc: z.array(z.string()),
  higher_level: z.array(z.string()).optional(),
  range: z.string(),
  components: z.array(z.enum(['V', 'S', 'M'])),
  material: z.string().optional(),
  ritual: z.boolean(),
  duration: z.string(),
  concentration: z.boolean(),
  casting_time: z.string(),
  attack_type: z.enum(['melee', 'ranged']).optional(),
  school: NameUrlSchema,
  classes: z.array(NameUrlSchema),
  subclasses: z.array(NameUrlSchema).optional(),
  area_of_effect: z
    .object({
      type: z.enum(['sphere', 'cube', 'cone', 'cylinder', 'line']),
      size: z.number(),
    })
    .optional(),
  dc: z
    .object({
      dc_type: NameUrlSchema.optional(),
      dc_success: z.enum(['none', 'half', 'other']).optional(),
      desc: z.string().optional(),
    })
    .optional(),
  damage: z
    .object({
      damage_type: NameUrlSchema.optional(),
      damage_at_slot_level: z.record(z.string(), z.string()).optional(),
      damage_at_character_level: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  heal_at_slot_level: z.record(z.string(), z.string()).optional(),
  url: z.string(), // '/api/2014/spells/...'
});

export const SpellListResponseSchema = z.object({
  count: z.number(),
  results: z.array(SpellSchema),
});

export type Spell = z.infer<typeof SpellSchema>;
export type SpellListResponse = z.infer<typeof SpellListResponseSchema>;
