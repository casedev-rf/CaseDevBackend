import { FastifyInstance } from 'fastify';
import { insuranceController } from '../controllers/insuranceController';

export async function insuranceRoutes(fastify: FastifyInstance) {
  fastify.get('/insurances', insuranceController.getAll);
  fastify.get('/insurances/:id', insuranceController.getById);
  fastify.post('/insurances', insuranceController.create);
  fastify.put('/insurances/:id', insuranceController.update);
  fastify.delete('/insurances/:id', insuranceController.remove);
}