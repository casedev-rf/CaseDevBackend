import { allocationService } from '../../src/services/allocationService';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('allocationService', () => {
  let simulationId: number;
  let versionId: number;
  let allocationId: number;
  const uniqueSimName = `Simulação Allocation ${Date.now()}`;

  beforeAll(async () => {
    // Cria simulação e versão para as alocações
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
    // Limpa alocação, versão e simulação
    if (allocationId) await allocationService.remove(allocationId);
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
  });

  it('deve criar uma alocação', async () => {
    const allocationData = {
      simulationVersionId: versionId,
      type: 'financeira',
      name: `Ativo Teste ${Date.now()}`,
      value: 5000,
      date: new Date(),
      hasFinancing: false
    };
    const allocation = await allocationService.create(allocationData);
    expect(allocation).toHaveProperty('id');
    expect(allocation.simulationVersionId).toBe(versionId);
    allocationId = allocation.id;
  });

  it('deve buscar alocação por id', async () => {
    const allocation = await allocationService.getById(allocationId);
    expect(allocation).not.toBeNull();
    expect(allocation?.id).toBe(allocationId);
  });

  it('deve atualizar alocação', async () => {
    const updated = await allocationService.update(allocationId, { value: 8000 });
    expect(updated.value).toBe(8000);
  });

  it('deve buscar todas as alocações', async () => {
    const all = await allocationService.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.find((a: any) => a.id === allocationId)).toBeDefined();
  });

  it('deve buscar histórico da alocação', async () => {
    const history = await allocationService.history(allocationId);
    expect(Array.isArray(history)).toBe(true);
    expect(history.find((a: any) => a.id === allocationId)).toBeDefined();
  });

  it('deve remover alocação', async () => {
    const removed = await allocationService.remove(allocationId);
    expect(removed).toHaveProperty('message');
    const after = await allocationService.getById(allocationId);
    expect(after).toBeNull();
    allocationId = 0;
  });
});
