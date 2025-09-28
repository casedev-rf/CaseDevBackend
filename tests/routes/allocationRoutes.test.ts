import Fastify from 'fastify';
import supertest from 'supertest';
import { allocationRoutes } from '../../src/routes/allocationRoutes';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';
import { allocationService } from '../../src/services/allocationService';

describe('Allocation Routes', () => {
  let app: any;
  let simulationId: number;
  let versionId: number;
  let allocationId: number;
  const uniqueSimName = `Simulação Route Allocation ${Date.now()}`;

  beforeAll(async () => {
    app = Fastify();
    app.register(allocationRoutes);
    await app.ready();
    // Cria simulação e versão para as alocações
    const sim = await simulationService.create(uniqueSimName);
    simulationId = sim.id;
    const version = await simulationVersionService.create({
      simulationId,
      status: 'Vivo',
      startDate: new Date().toISOString(),
      realRate: 4
    });
    versionId = version.id;
  });

  afterAll(async () => {
    if (allocationId) await allocationService.remove(allocationId);
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
    await app.close();
  });

  it('POST /allocations - should create an allocation', async () => {
    const res = await supertest(app.server)
      .post('/allocations')
      .send({
        simulationVersionId: versionId,
        type: 'financeira',
        name: `Ativo Route ${Date.now()}`,
        value: 10000,
        date: new Date().toISOString(),
        hasFinancing: false
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.simulationVersionId).toBe(versionId);
    allocationId = res.body.id;
  });

  it('GET /allocations/:id - should get allocation by id', async () => {
    const res = await supertest(app.server)
      .get(`/allocations/${allocationId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(allocationId);
  });

  it('GET /allocations/:id - should return 404 for not found', async () => {
    const res = await supertest(app.server)
      .get('/allocations/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /allocations/:id - should update allocation', async () => {
    const res = await supertest(app.server)
      .put(`/allocations/${allocationId}`)
      .send({ value: 20000 });
    expect(res.status).toBe(200);
    expect(res.body.value).toBe(20000);
  });

  it('DELETE /allocations/:id - should delete allocation', async () => {
    const allocation = await allocationService.create({
      simulationVersionId: versionId,
      type: 'financeira',
      name: `Ativo Delete ${Date.now()}`,
      value: 5000,
      date: new Date().toISOString(),
      hasFinancing: false
    });
    if ('id' in allocation) {
      const res = await supertest(app.server)
        .delete(`/allocations/${allocation.id}`);
      expect(res.status).toBe(204);
    } else {
      throw new Error('Falha ao criar alocação para teste de remoção');
    }
  });
});
