

import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('simulationService', () => {
  let createdId: number;
  let createdName = 'Simulação Teste';

  afterAll(async () => {
    // Limpeza: remove a simulação criada
    if (createdId) {
      await simulationService.remove(createdId);
    }
  });

  it('deve criar uma simulação', async () => {
    const created = await simulationService.create(createdName);
    expect(created).toHaveProperty('id');
    expect(created.name).toBe(createdName);
    createdId = created.id;
  });

  it('deve buscar simulação por id', async () => {
    const sim = await simulationService.getById(createdId);
    expect(sim).not.toBeNull();
    expect(sim?.name).toBe(createdName);
  });

  it('deve atualizar simulação', async () => {
    const updated = await simulationService.update(createdId, { name: 'Nome Atualizado' });
    expect(updated.name).toBe('Nome Atualizado');
  });

  it('deve retornar erro ao buscar projeção de simulação inexistente', async () => {
    const result = await simulationService.projection(99999);
    expect(result).toHaveProperty('error');
  });

  it('deve retornar projeção para simulação existente (mesmo sem dados)', async () => {
    // Gera um nome único para a versão
    const versionName = `Versão Teste ${Date.now()}`;
    await simulationVersionService.create({
      simulationId: createdId,
      status: 'Vivo',
      startDate: new Date(),
      realRate: 4,
      // Se houver campo name, pode adicionar: name: versionName
    });
    const result = await simulationService.projection(createdId);
    expect(result).toHaveProperty('simulationId');
    expect(result).toHaveProperty('projection');
    expect(Array.isArray(result.projection)).toBe(true);
  });

  it('deve duplicar simulação', async () => {
    const newName = `Simulação Duplicada ${Date.now()}`;
    const dup = await simulationService.duplicate(createdId, newName);
    expect(dup).toHaveProperty('newSimulationId');
    // Limpa duplicada
    await simulationService.remove(dup.newSimulationId);
  });

  it('deve retornar erro ao duplicar para nome já existente', async () => {
    const dup = await simulationService.duplicate(createdId, 'Nome Atualizado');
    expect(dup).toHaveProperty('error');
  });


  it('deve remover simulação', async () => {
    const sim = await simulationService.create('Para Remover');
    const removed = await simulationService.remove(sim.id);
    expect(removed).toHaveProperty('message');
    const after = await simulationService.getById(sim.id);
    expect(after).toBeNull();
  });
});
