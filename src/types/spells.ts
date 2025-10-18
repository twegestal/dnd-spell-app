import { z } from 'zod';
import {
  SpellSummarySchema,
  SpellListResponseSchema,
  SpellDetailSchema,
} from '../schemas/spellSchemas.js';
import { SpellFilterRequestSchema } from '../schemas/spellFilterRequest.js';

export type SpellSummary = z.infer<typeof SpellSummarySchema>;
export type SpellListResponse = z.infer<typeof SpellListResponseSchema>;
export type SpellDetail = z.infer<typeof SpellDetailSchema>;
export type SpellFilterRequest = z.infer<typeof SpellFilterRequestSchema>;
