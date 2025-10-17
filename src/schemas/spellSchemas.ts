import { z } from 'zod';

export const SpellSummarySchema = z.object({
  index: z.string(),
  name: z.string(),
  level: z.number(),
  url: z.string(),
});

export const SpellListResponseSchema = z.object({
  count: z.number(),
  results: z.array(SpellSummarySchema),
});

export const SpellIndexParamSchema = z.object({
  index: z.string().min(1, 'index is required'),
});

const NameUrlSchema = z.object({
  index: z.string(),
  name: z.string(),
  url: z.string(),
});

export const SpellDetailSchema = z.object({
  index: z.string(),
  name: z.string(),
  level: z.number(),
  desc: z.array(z.string()),
  higher_level: z.array(z.string()).optional(),
  range: z.string(),
  components: z.array(z.string()),
  material: z.string().optional(),
  ritual: z.boolean(),
  duration: z.string(),
  concentration: z.boolean(),
  casting_time: z.string(),
  attack_type: z.string().optional(),
  school: NameUrlSchema,
  classes: z.array(NameUrlSchema),
  subclasses: z.array(NameUrlSchema).optional(),
  area_of_effect: z.object({ type: z.string(), size: z.number() }).optional(),
  dc: z
    .object({
      dc_type: NameUrlSchema.optional(),
      dc_success: z.string().optional(),
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
});
