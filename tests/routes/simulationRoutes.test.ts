import Fastify from 'fastify';
import supertest from 'supertest';
import { simulationRoutes } from '../../src/routes/simulationRoutes';
import { simulationService } from '../../src/services/simulationService';

describe('Simulation Routes', () => {
  let app: any;
  let createdId: number;
  let createdName = `Simulação Route ${Date.now()}`;

  beforeAll(async () => {
    app = Fastify();
    app.register(simulationRoutes);
    await app.ready();
  });

  afterAll(async () => {
    if (createdId) await simulationService.remove(createdId);
    await app.close();
  });

  it('POST /simulations - should create a simulation', async () => {
    const res = await supertest(app.server)
      .post('/simulations')
      .send({ name: createdName });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(createdName);
    createdId = res.body.id;
  });

  it('GET /simulations/:id - should get simulation by id', async () => {
    const res = await supertest(app.server)
      .get(`/simulations/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(createdId);
  });

  it('GET /simulations/:id - should return 404 for not found', async () => {
    const res = await supertest(app.server)
      .get('/simulations/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /simulations - should list all simulations', async () => {
    const res = await supertest(app.server)
      .get('/simulations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /simulations/:id - should update simulation', async () => {
    const res = await supertest(app.server)
      .put(`/simulations/${createdId}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('DELETE /simulations/:id - should delete simulation', async () => {
    const sim = await simulationService.create('To Delete');
    const res = await supertest(app.server)
      .delete(`/simulations/${sim.id}`);
    expect(res.status).toBe(204);
  });
});
