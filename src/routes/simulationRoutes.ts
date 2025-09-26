import { FastifyInstance } from 'fastify';
import { simulationController } from '../controllers/simulationController';

export async function simulationRoutes(fastify: FastifyInstance) {
  fastify.get('/simulations', simulationController.getAll);
  fastify.get('/simulations/:id', simulationController.getById);
  fastify.post('/simulations', simulationController.create);
  fastify.put('/simulations/:id', simulationController.update);
  fastify.delete('/simulations/:id', simulationController.remove);
  fastify.post('/simulations/:id/projection', simulationController.projection);
}