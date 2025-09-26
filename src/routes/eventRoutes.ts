import { FastifyInstance } from 'fastify';
import { eventController } from '../controllers/eventController';

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get('/events', eventController.getAll);
  fastify.get('/events/:id', eventController.getById);
  fastify.post('/events', eventController.create);
  fastify.put('/events/:id', eventController.update);
  fastify.delete('/events/:id', eventController.remove);
}