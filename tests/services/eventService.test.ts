import { eventService } from '../../src/services/eventService';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('eventService', () => {
  let simulationId: number;
  let versionId: number;
  let eventId: number;
  const uniqueSimName = `Simulação Event ${Date.now()}`;

  beforeAll(async () => {
    // Cria simulação e versão para os eventos
    const sim = await simulationService.create(uniqueSimName);
    simulationId = sim.id;
    const version = await simulationVersionService.create({
      simulationId,
      status: 'Vivo',
      startDate: new Date(),
      realRate: 4
    });
    versionId = version.id;
  });

  afterAll(async () => {
    // Limpa evento, versão e simulação
    if (eventId) await eventService.remove(eventId);
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
  });

  it('deve criar um evento', async () => {
    const eventData = {
      type: 'entrada',
      value: 1000,
      frequency: 'mensal',
      startDate: new Date(),
      endDate: null
    };
    const event = await eventService.create(simulationId, eventData);
    expect(event).toHaveProperty('id');
    expect(event.simulationVersionId).toBe(versionId);
    eventId = event.id;
  });

  it('deve buscar evento por id', async () => {
    const event = await eventService.getById(eventId);
    expect(event).not.toBeNull();
    expect(event?.id).toBe(eventId);
  });

  it('deve atualizar evento', async () => {
    const updated = await eventService.update(eventId, { value: 2000 });
    expect(updated.value).toBe(2000);
  });

  it('deve buscar todos os eventos', async () => {
    const all = await eventService.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.find((e: any) => e.id === eventId)).toBeDefined();
  });

  it('deve remover evento', async () => {
    const removed = await eventService.remove(eventId);
    expect(removed).toHaveProperty('message');
    const after = await eventService.getById(eventId);
    expect(after).toBeNull();
    eventId = 0;
  });
});
