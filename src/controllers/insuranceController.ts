import { FastifyRequest, FastifyReply } from 'fastify';
import { insuranceService } from '../services/insuranceService';
import { insuranceCreateSchema } from '../schemas/insuranceCreateSchema';
import { insuranceUpdateSchema } from '../schemas/insuranceUpdateSchema';

export const insuranceController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await insuranceService.getAll();
    return reply.send(result);
  },
  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const result = await insuranceService.getById(id);
    if (!result) return reply.code(404).send({ message: 'Not found' });
    return reply.send(result);
  },
  async create(request: FastifyRequest, reply: FastifyReply) {
    const parseResult = insuranceCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const result = await insuranceService.create(parseResult.data);
    return reply.code(201).send(result);
  },
  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parseResult = insuranceUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const id = Number(request.params.id);
    const result = await insuranceService.update(id, parseResult.data);
    return reply.send(result);
  },
  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await insuranceService.remove(id);
    return reply.code(204).send();
  }
};