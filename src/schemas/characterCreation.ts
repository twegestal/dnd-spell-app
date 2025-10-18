import { z } from 'zod';

export const CharacterCreationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  race: z.string().min(1, 'Race is required').max(100),
  class: z.string().min(1, 'Class is required').max(100),
  level: z.number().int().min(1).max(20),
});
