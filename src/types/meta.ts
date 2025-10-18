import type { z } from 'zod';
import type {
  MetaItemSchema,
  MetaListResponseSchema,
} from '../schemas/metaSchemas.js';

export type MetaItem = z.infer<typeof MetaItemSchema>;
export type MetaListResponse = z.infer<typeof MetaListResponseSchema>;
