import { z } from 'zod';

export const MetaItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const MetaListResponseSchema = z.object({
  count: z.number(),
  results: z.array(MetaItemSchema),
});

export type MetaItem = z.infer<typeof MetaItemSchema>;
export type MetaListResponse = z.infer<typeof MetaListResponseSchema>;
