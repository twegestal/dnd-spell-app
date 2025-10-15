import { z } from 'zod';
import { exampleSchema } from '../validators';

export type Example = z.infer<typeof exampleSchema>;
