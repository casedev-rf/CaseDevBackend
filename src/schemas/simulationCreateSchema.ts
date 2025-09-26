import { z } from 'zod';

export const simulationCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório')
});