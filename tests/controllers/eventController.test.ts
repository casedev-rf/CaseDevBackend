import { eventController } from '../../src/controllers/eventController';
import { eventService } from '../../src/services/eventService';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('eventController', () => {
  let simulationId: number;
  let versionId: number;
  let eventId: number;
  const uniqueSimName = `Simulação Controller Event ${Date.now()}`;

  const mockReply = () => {
    const reply: any = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    return reply;
  };

  beforeAll(async () => {
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
  });

  it('deve criar um evento', async () => {
    // Garante que existe uma versão para a simulação
    await simulationVersionService.create({
      simulationId,
      status: 'Vivo',
      startDate: new Date().toISOString(),
      realRate: 4
    });
    const request: any = {
      params: { id: simulationId.toString() },
      body: {
        type: 'entrada',
        value: 1000,
        frequency: 'mensal',
        startDate: new Date().toISOString()
        // endDate removido para evitar erro de tipo
      }
    };
    const reply = mockReply();
    await eventController.create(request, reply);
    expect(reply.code).toHaveBeenCalledWith(201);
    const event = reply.send.mock.calls[0][0];
    expect(event).toHaveProperty('id');
    eventId = event.id;
  });

  it('deve buscar evento por id', async () => {
    const request: any = { params: { id: eventId.toString() } };
    const reply = mockReply();
    await eventController.getById(request, reply);
    expect(reply.send).toHaveBeenCalled();
    const event = reply.send.mock.calls[0][0];
    expect(event).toHaveProperty('id');
    expect(event.id).toBe(eventId);
  });

  it('deve retornar 404 para evento inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await eventController.getById(request, reply);
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
