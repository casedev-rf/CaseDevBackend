import { z } from 'zod';

export const allocationUpdateSchema = z.object({
  simulationVersionId: z.number().optional(),
  type: z.enum(['financeira', 'imobilizada']).optional(),
  name: z.string().min(1).optional(),
  value: z.number().optional(),
  date: z.string().optional(),
  hasFinancing: z.boolean().optional(),
  financingStartDate: z.string().optional(),
  financingInstallments: z.number().optional(),
  financingRate: z.number().optional(),
  financingEntryValue: z.number().optional()
});