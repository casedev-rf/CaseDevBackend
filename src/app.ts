import { allocationRoutes } from './routes/allocationRoutes';
import { eventRoutes } from './routes/eventRoutes';
import { insuranceRoutes } from './routes/insuranceRoutes';
import { simulationRoutes } from './routes/simulationRoutes';
import { simulationVersionRoutes } from './routes/simulationVersionRoutes';
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const fastify = Fastify();

fastify.register(swagger, {
  openapi: {
    info: {
      title: 'CaseDevBack API',
      description: 'Documentação da API do case Dev Full-Stack',
      version: '1.0.0'
    }
  }
});
fastify.register(swaggerUi, {
  routePrefix: '/docs'
});

fastify.register(simulationRoutes);
fastify.register(simulationVersionRoutes);
fastify.register(allocationRoutes);
fastify.register(eventRoutes);
fastify.register(insuranceRoutes);

fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});