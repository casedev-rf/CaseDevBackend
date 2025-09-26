import { z } from 'zod';

export const simulationVersionCreateSchema = z.object({
  simulationId: z.number(),
  status: z.enum(['Vivo', 'Morto', 'Inválido']),
  startDate: z.string(), 
  realRate: z.number()
});