import { simulationController } from '../../src/controllers/simulationController';
import { simulationService } from '../../src/services/simulationService';
import { FastifyReply } from 'fastify';

describe('simulationController', () => {
  let createdId: number;
  let createdName = `Simulação Controller ${Date.now()}`;

  const mockReply = () => {
    const reply: any = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    return reply;
  };

  afterAll(async () => {
    if (createdId) await simulationService.remove(createdId);
  });

  it('deve criar uma simulação', async () => {
    const request: any = { body: { name: createdName } };
    const reply = mockReply();
    await simulationController.create(request, reply);
    expect(reply.code).toHaveBeenCalledWith(201);
    const sim = reply.send.mock.calls[0][0];
    expect(sim).toHaveProperty('id');
    expect(sim.name).toBe(createdName);
    createdId = sim.id;
  });

  it('deve buscar simulação por id', async () => {
    const request: any = { params: { id: createdId.toString() } };
    const reply = mockReply();
    await simulationController.getById(request, reply);
    expect(reply.send).toHaveBeenCalled();
    const sim = reply.send.mock.calls[0][0];
    expect(sim).toHaveProperty('id');
    expect(sim.id).toBe(createdId);
  });

  it('deve retornar 404 para simulação inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await simulationController.getById(request, reply);
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: 'Simulation not found' });
  });
});
