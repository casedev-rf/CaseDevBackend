import { simulationVersionController } from '../../src/controllers/simulationVersionController';
import { simulationVersionService } from '../../src/services/simulationVersionService';
import { simulationService } from '../../src/services/simulationService';

describe('simulationVersionController', () => {
  let simulationId: number;
  let versionId: number;
  const uniqueSimName = `Simulação Controller Version ${Date.now()}`;

  const mockReply = () => {
    const reply: any = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    return reply;
  };

  beforeAll(async () => {
    // Cria simulação para associar a versão
    const sim = await simulationService.create(uniqueSimName);
    simulationId = sim.id;
  });

  afterAll(async () => {
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
  });

  it('deve criar uma versão de simulação', async () => {
    const request: any = {
      body: {
        simulationId,
        status: 'Vivo',
        startDate: new Date().toISOString(),
        realRate: 4
      }
    };
    const reply = mockReply();
    await simulationVersionController.create(request, reply);
    expect(reply.code).toHaveBeenCalledWith(201);
    const version = reply.send.mock.calls[0][0];
    expect(version).toHaveProperty('id');
    expect(version.simulationId).toBe(simulationId);
    versionId = version.id;
  });

  it('deve buscar versão por id', async () => {
    const request: any = { params: { id: versionId.toString() } };
    const reply = mockReply();
    await simulationVersionController.getById(request, reply);
    expect(reply.send).toHaveBeenCalled();
    const version = reply.send.mock.calls[0][0];
    expect(version).toHaveProperty('id');
    expect(version.id).toBe(versionId);
  });

  it('deve retornar 404 para versão inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await simulationVersionController.getById(request, reply);
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
