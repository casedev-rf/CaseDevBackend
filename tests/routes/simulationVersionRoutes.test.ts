import Fastify from 'fastify';
import supertest from 'supertest';
import { simulationVersionRoutes } from '../../src/routes/simulationVersionRoutes';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('SimulationVersion Routes', () => {
  let app: any;
  let simulationId: number;
  let versionId: number;
  const uniqueSimName = `Simulação Route Version ${Date.now()}`;

  beforeAll(async () => {
    app = Fastify();
    app.register(simulationVersionRoutes);
    await app.ready();
    // Cria simulação para associar a versão
    const sim = await simulationService.create(uniqueSimName);
    simulationId = sim.id;
  });

  afterAll(async () => {
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
    await app.close();
  });

  it('POST /simulation-versions - should create a simulation version', async () => {
    const res = await supertest(app.server)
      .post('/simulation-versions')
      .send({
        simulationId,
        status: 'Vivo',
        startDate: new Date().toISOString(),
        realRate: 4
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.simulationId).toBe(simulationId);
    versionId = res.body.id;
  });

  it('GET /simulation-versions/:id - should get version by id', async () => {
    const res = await supertest(app.server)
      .get(`/simulation-versions/${versionId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(versionId);
  });

  it('GET /simulation-versions/:id - should return 404 for not found', async () => {
    const res = await supertest(app.server)
      .get('/simulation-versions/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /simulation-versions/:id - should update version', async () => {
    const res = await supertest(app.server)
      .put(`/simulation-versions/${versionId}`)
      .send({ realRate: 8 });
    expect(res.status).toBe(200);
    expect(res.body.realRate).toBe(8);
  });

  it('DELETE /simulation-versions/:id - should delete version', async () => {
    const version = await simulationVersionService.create({
      simulationId,
      status: 'Vivo',
      startDate: new Date().toISOString(),
      realRate: 4
    });
    if ('id' in version) {
      const res = await supertest(app.server)
        .delete(`/simulation-versions/${version.id}`);
      expect(res.status).toBe(204);
    } else {
      throw new Error('Falha ao criar versão para teste de remoção');
    }
  });
});
