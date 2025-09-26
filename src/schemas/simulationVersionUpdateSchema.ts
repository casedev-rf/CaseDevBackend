import { z } from 'zod';

export const simulationVersionUpdateSchema = z.object({
  simulationId: z.number().optional(),
  status: z.enum(['Vivo', 'Morto', 'Inválido']).optional(),
  startDate: z.string().optional(),
  realRate: z.number().optional()
});