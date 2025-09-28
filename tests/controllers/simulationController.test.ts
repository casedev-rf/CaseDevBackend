import { simulationController } from '../../src/controllers/simulationController';
import { simulationService } from '../../src/services/simulationService';

const mockReply = () => {
  const reply: any = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  return reply;
};

let createdId: number;
let createdName = `Simulação Controller ${Date.now()}`;

describe('simulationController', () => {
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

  it('deve atualizar simulação', async () => {
    const request: any = { params: { id: createdId.toString() }, body: { name: 'Nome Atualizado Controller' } };
    const reply = mockReply();
    await simulationController.update(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0].name).toBe('Nome Atualizado Controller');
  });

  it('deve remover simulação', async () => {
    const sim = await simulationService.create('Para Remover Controller');
    const request: any = { params: { id: sim.id.toString() } };
    const reply = mockReply();
    await simulationController.remove(request, reply);
    expect(reply.send).toHaveBeenCalledWith({ message: `Simulação ${sim.id} deletada com sucesso.` });
  });

  it('deve retornar erro ao remover simulação inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await simulationController.remove(request, reply);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Simulação não encontrada.' });
  });

  it('deve retornar projeção para simulação existente', async () => {
    const request: any = { params: { id: createdId.toString() }, query: { status: 'Vivo' } };
    const reply = mockReply();
    await simulationController.projection(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('projection');
  });

  it('deve retornar erro ao projetar simulação inexistente', async () => {
    const request: any = { params: { id: '999999' }, query: { status: 'Vivo' } };
    const reply = mockReply();
    await simulationController.projection(request, reply);
    expect(reply.send).toHaveBeenCalledWith({ error: 'Simulation/version not found' });
  });

  it('deve duplicar simulação', async () => {
    const newName = `Simulação Duplicada Controller ${Date.now()}`;
    const request: any = { params: { id: createdId.toString() }, body: { name: newName } };
    const reply = mockReply();
    await simulationController.duplicate(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('newSimulationId');
    // Limpa duplicada
    await simulationService.remove(reply.send.mock.calls[0][0].newSimulationId);
  });

  it('deve retornar erro ao duplicar para nome já existente', async () => {
    const request: any = { params: { id: createdId.toString() }, body: { name: createdName } };
    const reply = mockReply();
    await simulationController.duplicate(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('error');
  });

  it('deve retornar erro ao duplicar simulação inexistente', async () => {
    const request: any = { params: { id: '999999' }, body: { name: 'Nome Inexistente' } };
    const reply = mockReply();
    await simulationController.duplicate(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('error');
  });

  it('deve criar situação atual com sucesso', async () => {
    // Cria simulação e versão base
    const sim = await simulationService.create('Situação Atual Controller');
    await simulationService.createCurrent(sim.id); // cria versão base e current
    const request: any = { params: { id: sim.id.toString() } };
    const reply = mockReply();
    await simulationController.createCurrent(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('simulationId');
    await simulationService.remove(sim.id);
  });

  it('deve retornar erro ao criar situação atual se já existe', async () => {
    // Cria simulação e versão base
    const sim = await simulationService.create('Situação Atual Controller 2');
    await simulationService.createCurrent(sim.id); // cria versão base e current
    const request: any = { params: { id: sim.id.toString() } };
    const reply = mockReply();
    await simulationController.createCurrent(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('error');
    await simulationService.remove(sim.id);
  });

  it('deve retornar erro ao criar situação atual para simulação inexistente', async () => {
    const request: any = { params: { id: '999999' } };
    const reply = mockReply();
    await simulationController.createCurrent(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(reply.send.mock.calls[0][0]).toHaveProperty('error');
  });

  it('deve retornar todas as simulações', async () => {
    const request: any = {};
    const reply = mockReply();
    await simulationController.getAll(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(Array.isArray(reply.send.mock.calls[0][0])).toBe(true);
  });

  it('deve retornar todas as versões recentes', async () => {
    const request: any = {};
    const reply = mockReply();
    await simulationController.getAllRecent(request, reply);
    expect(reply.send).toHaveBeenCalled();
    expect(Array.isArray(reply.send.mock.calls[0][0])).toBe(true);
  });