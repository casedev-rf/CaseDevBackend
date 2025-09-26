import { z } from 'zod';

export const insuranceUpdateSchema = z.object({
  simulationVersionId: z.number().optional(),
  name: z.string().min(1).optional(),
  startDate: z.string().optional(),
  durationMonths: z.number().optional(),
  premium: z.number().optional(),
  insuredValue: z.number().optional()
});