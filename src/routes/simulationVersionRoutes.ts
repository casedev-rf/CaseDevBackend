import { FastifyInstance } from 'fastify';
import { simulationVersionController } from '../controllers/simulationVersionController';

export async function simulationVersionRoutes(fastify: FastifyInstance) {
  fastify.post('/simulation-versions', {
    schema: {
      body: {
        type: 'object',
        required: ['simulationId', 'status', 'startDate', 'realRate'],
        properties: {
          simulationId: { type: 'number' },
          status: { type: 'string', enum: ['Vivo', 'Morto', 'Inválido'] },
          startDate: { type: 'string' },
          realRate: { type: 'number' }
        }
      }
    }
  }, simulationVersionController.create);
  fastify.put('/simulation-versions/:id', {
    schema: {
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          simulationId: { type: 'number' },
          status: { type: 'string', enum: ['Vivo', 'Morto', 'Inválido'] },
          startDate: { type: 'string' },
          realRate: { type: 'number' }
        },
        additionalProperties: false
      }
    }
  }, simulationVersionController.update);
  fastify.get('/simulation-versions', simulationVersionController.getAll);
  fastify.get('/simulation-versions/:id', simulationVersionController.getById);
  fastify.delete('/simulation-versions/:id', simulationVersionController.remove);
}