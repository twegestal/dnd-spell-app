import { z } from 'zod';
import { CharacterCreationSchema } from '../schemas/characterCreation.js';

export type CharacterRow = {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  created_at: string;
  updated_at: string;
};

export type CharacterCreation = z.infer<typeof CharacterCreationSchema>;
