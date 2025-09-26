import { FastifyInstance } from 'fastify';
import { allocationController } from '../controllers/allocationController';

export async function allocationRoutes(fastify: FastifyInstance) {
  fastify.get('/allocations', allocationController.getAll);
  fastify.get('/allocations/:id', allocationController.getById);
  fastify.post('/allocations', allocationController.create);
  fastify.put('/allocations/:id', allocationController.update);
  fastify.delete('/allocations/:id', allocationController.remove);
}