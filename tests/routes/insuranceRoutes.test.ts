import Fastify from 'fastify';
import supertest from 'supertest';
import { insuranceRoutes } from '../../src/routes/insuranceRoutes';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';
import { insuranceService } from '../../src/services/insuranceService';

describe('Insurance Routes', () => {
  let app: any;
  let simulationId: number;
  let versionId: number;
  let insuranceId: number;
  const uniqueSimName = `Simulação Route Insurance ${Date.now()}`;

  beforeAll(async () => {
    app = Fastify();
    app.register(insuranceRoutes);
    await app.ready();
    // Cria simulação e versão para os seguros
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
    if (insuranceId) await insuranceService.remove(insuranceId);
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
    await app.close();
  });

  it('POST /insurances - should create an insurance', async () => {
    const res = await supertest(app.server)
      .post('/insurances')
      .send({
        simulationVersionId: versionId,
        name: `Seguro Route ${Date.now()}`,
        startDate: new Date().toISOString(),
        durationMonths: 12,
        premium: 100,
        insuredValue: 10000
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.simulationVersionId).toBe(versionId);
    insuranceId = res.body.id;
  });

  it('GET /insurances/:id - should get insurance by id', async () => {
    const res = await supertest(app.server)
      .get(`/insurances/${insuranceId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(insuranceId);
  });

  it('GET /insurances/:id - should return 404 for not found', async () => {
    const res = await supertest(app.server)
      .get('/insurances/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /insurances/:id - should update insurance', async () => {
    const res = await supertest(app.server)
      .put(`/insurances/${insuranceId}`)
      .send({ premium: 200 });
    expect(res.status).toBe(200);
    expect(res.body.premium).toBe(200);
  });

  it('DELETE /insurances/:id - should delete insurance', async () => {
    const insurance = await insuranceService.create({
      simulationVersionId: versionId,
      name: `Seguro Delete ${Date.now()}`,
      startDate: new Date().toISOString(),
      durationMonths: 6,
      premium: 50,
      insuredValue: 5000
    });
    if ('id' in insurance) {
      const res = await supertest(app.server)
        .delete(`/insurances/${insurance.id}`);
      expect(res.status).toBe(204);
    } else {
      throw new Error('Falha ao criar seguro para teste de remoção');
    }
  });
});
