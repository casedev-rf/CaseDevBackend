import { FastifyRequest, FastifyReply } from 'fastify';
import { simulationService } from '../services/simulationService';
import { simulationCreateSchema } from '../schemas/simulationCreateSchema';
import { simulationUpdateSchema } from '../schemas/simulationUpdateSchema';

export const simulationController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const simulations = await simulationService.getAll();
    return reply.send(simulations);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const simulation = await simulationService.getById(id);
    if (!simulation) return reply.code(404).send({ message: 'Simulation not found' });
    return reply.send(simulation);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parseResult = simulationCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const simulation = await simulationService.create(parseResult.data.name);
    return reply.code(201).send(simulation);
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parseResult = simulationUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const id = Number(request.params.id);
    const result = await simulationService.update(id, parseResult.data);
    return reply.send(result);
  },

  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await simulationService.remove(id);
    return reply.code(204).send();
  },

  async projection(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const result = await simulationService.projection(id);
    return reply.send(result);
  },
};