import { z } from 'zod';

export const insuranceCreateSchema = z.object({
  simulationVersionId: z.number(),
  name: z.string().min(1),
  startDate: z.string().min(1),
  durationMonths: z.number(),
  premium: z.number(),
  insuredValue: z.number()
});