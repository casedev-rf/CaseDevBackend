import { FastifyInstance } from 'fastify';
import { simulationVersionController } from '../controllers/simulationVersionController';

export async function simulationVersionRoutes(fastify: FastifyInstance) {
  fastify.get('/simulation-versions', simulationVersionController.getAll);
  fastify.get('/simulation-versions/:id', simulationVersionController.getById);
  fastify.post('/simulation-versions', simulationVersionController.create);
  fastify.put('/simulation-versions/:id', simulationVersionController.update);
  fastify.delete('/simulation-versions/:id', simulationVersionController.remove);
}