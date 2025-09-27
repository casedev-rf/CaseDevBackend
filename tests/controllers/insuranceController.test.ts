import { insuranceController } from '../../src/controllers/insuranceController';
import { insuranceService } from '../../src/services/insuranceService';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('insuranceController', () => {
  let simulationId: number;
  let versionId: number;
  let insuranceId: number;
  const uniqueSimName = `Simulação Controller Insurance ${Date.now()}`;

  const mockReply = () => {
    const reply: any = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    return reply;
  };

  beforeAll(async () => {
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
  });

  it('deve criar um seguro', async () => {
    const request: any = {
      body: {
        simulationVersionId: versionId,
        name: `Seguro Controller ${Date.now()}`,
        startDate: new Date().toISOString(),
        durationMonths: 12,
        premium: 100,
        insuredValue: 10000
      }
    };
    const reply = mockReply();
    await insuranceController.create(request, reply);
    expect(reply.code).toHaveBeenCalledWith(201);
    const insurance = reply.send.mock.calls[0][0];
    expect(insurance).toHaveProperty('id');
    expect(insurance.simulationVersionId).toBe(versionId);
    insuranceId = insurance.id;
  });

  it('deve buscar seguro por id', async () => {
    const request: any = { params: { id: insuranceId.toString() } };
    const reply = mockReply();
    await insuranceController.getById(request, reply);
    expect(reply.send).toHaveBeenCalled();
    const insurance = reply.send.mock.calls[0][0];
    expect(insurance).toHaveProperty('id');
    expect(insurance.id).toBe(insuranceId);
  });

  it('deve retornar 404 para seguro inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await insuranceController.getById(request, reply);
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
