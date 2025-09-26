import { z } from 'zod';

export const simulationUpdateSchema = z.object({
  name: z.string().min(1).optional()
});