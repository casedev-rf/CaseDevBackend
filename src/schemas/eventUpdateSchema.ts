import { z } from 'zod';

export const eventUpdateSchema = z.object({
  simulationVersionId: z.number().optional(),
  type: z.string().min(1).optional(),
  value: z.number().optional(),
  frequency: z.enum(['única', 'mensal', 'anual']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});