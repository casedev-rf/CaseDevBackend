import { allocationCreateSchema } from '../schemas/allocationCreateSchema';
import { allocationService } from '../services/allocationService';
import { allocationUpdateSchema } from '../schemas/allocationUpdateSchema';
import { FastifyRequest, FastifyReply } from 'fastify';

export const allocationController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await allocationService.getAll();
    return reply.send(result);
  },
  
  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const result = await allocationService.getById(id);
    if (!result) return reply.code(404).send({ message: 'Not found' });
    return reply.send(result);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parseResult = allocationCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const result = await allocationService.create(parseResult.data);
    return reply.code(201).send(result);
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parseResult = allocationUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const id = Number(request.params.id);
    const result = await allocationService.update(id, parseResult.data);
    return reply.send(result);
  },

  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await allocationService.remove(id);
    return reply.code(204).send();
  },
};