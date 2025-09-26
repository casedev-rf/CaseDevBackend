import Fastify from 'fastify';
import { simulationRoutes } from './routes/simulationRoutes';
import { simulationVersionRoutes } from './routes/simulationVersionRoutes';
import { allocationRoutes } from './routes/allocationRoutes';
import { eventRoutes } from './routes/eventRoutes';
import { insuranceRoutes } from './routes/insuranceRoutes';

const fastify = Fastify();

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