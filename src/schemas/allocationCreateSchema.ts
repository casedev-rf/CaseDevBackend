import { z } from 'zod';

export const allocationCreateSchema = z.object({
  simulationVersionId: z.number(),
  type: z.enum(['financeira', 'imobilizada']),
  name: z.string().min(1),
  value: z.number(),
  date: z.string(),
  hasFinancing: z.boolean().optional(),
  financingStartDate: z.string().optional(),
  financingInstallments: z.number().optional(),
  financingRate: z.number().optional(),
  financingEntryValue: z.number().optional()
});