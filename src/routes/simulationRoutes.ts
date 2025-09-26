import { FastifyInstance } from 'fastify';
import { simulationController } from '../controllers/simulationController';
import { simulationCreateSchema } from '../schemas/simulationCreateSchema';
import { simulationUpdateSchema } from '../schemas/simulationUpdateSchema';
import { zodToJsonSchema } from 'zod-to-json-schema';

export async function simulationRoutes(fastify: FastifyInstance) {
  fastify.post('/simulations', {
    schema: {
      body: zodToJsonSchema(simulationCreateSchema),
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        }
      }
    }
  }, simulationController.create);
  fastify.get('/simulations', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
  }, simulationController.getAll);
  fastify.get('/simulations/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        }
      }
    }
  }, simulationController.getById);
  fastify.put('/simulations/:id', {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    },
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      }
    }
  }
}, simulationController.update);
  fastify.delete('/simulations/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        204: { description: 'No Content' }
      }
    }
  }, simulationController.remove);
  fastify.post('/simulations/:id/projection', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['Vivo', 'Morto', 'Inválido'], default: 'Vivo' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            simulationId: { type: 'number' },
            status: { type: 'string' },
            projection: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    }
  }, simulationController.projection);
  fastify.post('/simulations/:id/duplicate', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            newSimulationId: { type: 'number' }
          }
        }
      }
    }
  }, simulationController.duplicate);
  fastify.get('/simulations/recent', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              versions: { type: 'array', items: { type: 'object' } },
              legacyVersions: { type: 'array', items: { type: 'object' } }
            }
          }
        }
      }
    }
  }, simulationController.getAllRecent);
}