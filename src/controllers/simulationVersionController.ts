import { FastifyRequest, FastifyReply } from 'fastify';
import { simulationVersionService } from '../services/simulationVersionService';
import { simulationVersionCreateSchema } from '../schemas/simulationVersionCreateSchema';
import { simulationVersionUpdateSchema } from '../schemas/simulationVersionUpdateSchema';

export const simulationVersionController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await simulationVersionService.getAll();
    return reply.send(result);
  },
  
  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const result = await simulationVersionService.getById(id);
    if (!result) return reply.code(404).send({ message: 'Not found' });
    return reply.send(result);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parseResult = simulationVersionCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const result = await simulationVersionService.create(parseResult.data);
    return reply.code(201).send(result);
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parseResult = simulationVersionUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const id = Number(request.params.id);
    const result = await simulationVersionService.update(id, parseResult.data);
    return reply.send(result);
  },

  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await simulationVersionService.remove(id);
    return reply.code(204).send();
  }
};