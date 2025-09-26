import { z } from 'zod';

export const eventCreateSchema = z.object({
  simulationVersionId: z.number(),
  type: z.string().min(1), 
  value: z.number(),
  frequency: z.enum(['única', 'mensal', 'anual']),
  startDate: z.string(),
  endDate: z.string().optional()
});