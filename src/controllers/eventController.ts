import { FastifyRequest, FastifyReply } from 'fastify';
import { eventService } from '../services/eventService';
import { eventCreateSchema } from '../schemas/eventCreateSchema';
import { eventUpdateSchema } from '../schemas/eventUpdateSchema';

export const eventController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await eventService.getAll();
    return reply.send(result);
  },
  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const result = await eventService.getById(id);
    if (!result) return reply.code(404).send({ message: 'Not found' });
    return reply.send(result);
  },
  async create(request: FastifyRequest, reply: FastifyReply) {
    const parseResult = eventCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const result = await eventService.create(parseResult.data);
    return reply.code(201).send(result);
  },
  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parseResult = eventUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const id = Number(request.params.id);
    const result = await eventService.update(id, parseResult.data);
    return reply.send(result);
  },
  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await eventService.remove(id);
    return reply.code(204).send();
  }
};