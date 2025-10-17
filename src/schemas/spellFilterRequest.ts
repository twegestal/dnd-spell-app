import { z } from 'zod';

const level = z.union([
  z.number().int().min(0).max(9),
  z.array(z.number().int().min(0).max(9)).min(1),
]);

const strOrStrArray = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
]);

export const SpellFilterRequestSchema = z.object({
  level: level.optional(),
  school: strOrStrArray.optional(), // e.g. "evocation"
  class: strOrStrArray.optional(), // e.g. "wizard"
  subclass: strOrStrArray.optional(), // e.g. "school-of-evocation"
  casting_time: strOrStrArray.optional(), // e.g. "1 action", "1 bonus action", "reaction"
  damage_type: strOrStrArray.optional(), // e.g. "fire", "acid"
  dc_type: strOrStrArray.optional(), // e.g. "dexterity", "wisdom"
  concentration: z.boolean().optional(),
  ritual: z.boolean().optional(),
  range: strOrStrArray.optional(), // e.g. "Self", "Touch", "60 feet"
  attack_type: strOrStrArray.optional(), // e.g. "melee", "ranged" (check exact values in API)
  area_of_effect: z
    .object({
      size: z
        .object({
          eq: z.number().int().optional(),
          in: z.array(z.number().int()).optional(),
          nin: z.array(z.number().int()).optional(),
          range: z
            .object({
              gt: z.number().int().optional(),
              gte: z.number().int().optional(),
              lt: z.number().int().optional(),
              lte: z.number().int().optional(),
            })
            .optional(),
        })
        .optional(),
      type: z.array(z.string().min(1)).optional(), // e.g. ["sphere","cone"]
    })
    .optional(),

  // Not supported by GraphQL filter; we will post-filter on server:
  components: z
    .object({
      includesAny: z.array(z.enum(['V', 'S', 'M'])).optional(),
      includesAll: z.array(z.enum(['V', 'S', 'M'])).optional(),
    })
    .optional(),

  // Pagination / ordering passthroughs
  limit: z.number().int().min(1).max(500).optional(),
  skip: z.number().int().min(0).optional(),
  order: z
    .object({
      by: z.enum(['AREA_OF_EFFECT_SIZE', 'LEVEL', 'NAME', 'SCHOOL']),
      direction: z.enum(['ASC', 'DESC']),
      then_by: z.any().optional(), // keep simple; API supports chaining
    })
    .optional(),
});
