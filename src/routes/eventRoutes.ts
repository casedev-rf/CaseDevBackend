import { eventController } from '../controllers/eventController';
import { FastifyInstance } from 'fastify';

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get('/events', eventController.getAll);
  fastify.get('/events/:id', eventController.getById);
  fastify.post('/simulations/:id/events', eventController.create);
  fastify.put('/events/:id', eventController.update);
  fastify.delete('/events/:id', eventController.remove);
}