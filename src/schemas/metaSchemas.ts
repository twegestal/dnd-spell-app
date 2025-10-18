import { z } from 'zod';

export const MetaItemSchema = z.object({
  index: z.string(),
  name: z.string(),
  url: z.string(),
});

export const MetaListResponseSchema = z.object({
  count: z.number(),
  results: z.array(MetaItemSchema),
});
