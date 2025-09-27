import { allocationController } from '../../src/controllers/allocationController';
import { allocationService } from '../../src/services/allocationService';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('allocationController', () => {
  let simulationId: number;
  let versionId: number;
  let allocationId: number;
  const uniqueSimName = `Simulação Controller Allocation ${Date.now()}`;

  const mockReply = () => {
    const reply: any = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    return reply;
  };

  beforeAll(async () => {
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
  });

  it('deve criar uma alocação', async () => {
    const request: any = {
      body: {
        simulationVersionId: versionId,
        type: 'financeira',
        name: `Ativo Controller ${Date.now()}`,
        value: 10000,
        date: new Date().toISOString(),
        hasFinancing: false
      }
    };
    const reply = mockReply();
    await allocationController.create(request, reply);
    expect(reply.code).toHaveBeenCalledWith(201);
    const allocation = reply.send.mock.calls[0][0];
    expect(allocation).toHaveProperty('id');
    expect(allocation.simulationVersionId).toBe(versionId);
    allocationId = allocation.id;
  });

  it('deve buscar alocação por id', async () => {
    const request: any = { params: { id: allocationId.toString() } };
    const reply = mockReply();
    await allocationController.getById(request, reply);
    expect(reply.send).toHaveBeenCalled();
    const allocation = reply.send.mock.calls[0][0];
    expect(allocation).toHaveProperty('id');
    expect(allocation.id).toBe(allocationId);
  });

  it('deve retornar 404 para alocação inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await allocationController.getById(request, reply);
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
