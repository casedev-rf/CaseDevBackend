import { z } from 'zod';

export const insuranceCreateSchema = z.object({
  simulationVersionId: z.number().positive(),
  name: z.string().min(1, "Nome é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  durationMonths: z.number().positive("Duração deve ser positiva"),
  premium: z.number().positive("Prêmio deve ser positivo"),
  insuredValue: z.number().positive("Valor segurado deve ser positivo")
});