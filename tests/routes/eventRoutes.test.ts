import Fastify from 'fastify';
import supertest from 'supertest';
import { eventRoutes } from '../../src/routes/eventRoutes';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';
import { eventService } from '../../src/services/eventService';

describe('Event Routes', () => {
  let app: any;
  let simulationId: number;
  let versionId: number;
  let eventId: number;
  const uniqueSimName = `Simulação Route Event ${Date.now()}`;

  beforeAll(async () => {
    app = Fastify();
    app.register(eventRoutes);
    await app.ready();
    // Cria simulação e versão para os eventos
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
    if (eventId) await eventService.remove(eventId);
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
    await app.close();
  });


  it('POST /simulations/:id/events - should create an event', async () => {
    const res = await supertest(app.server)
      .post(`/simulations/${simulationId}/events`)
      .send({
        simulationVersionId: versionId,
        type: 'entrada',
        value: 1000,
        frequency: 'mensal',
        startDate: new Date().toISOString()
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.simulationVersionId).toBe(versionId);
    eventId = res.body.id;
  });

  it('GET /events/:id - should get event by id', async () => {
    const res = await supertest(app.server)
      .get(`/events/${eventId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(eventId);
  });

  it('GET /events/:id - should return 404 for not found', async () => {
    const res = await supertest(app.server)
      .get('/events/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /events/:id - should update event', async () => {
    const res = await supertest(app.server)
      .put(`/events/${eventId}`)
      .send({ value: 2000 });
    expect(res.status).toBe(200);
    expect(res.body.value).toBe(2000);
  });

  it('DELETE /events/:id - should delete event', async () => {
    const event = await eventService.create(simulationId, {
      simulationVersionId: versionId,
      type: 'entrada',
      value: 500,
      frequency: 'única',
      startDate: new Date().toISOString()
    });
    if ('id' in event) {
      const res = await supertest(app.server)
        .delete(`/events/${event.id}`);
      expect(res.status).toBe(204);
    } else {
      throw new Error('Falha ao criar evento para teste de remoção');
    }
  });
});
