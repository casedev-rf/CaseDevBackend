import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

// Teste de integração entre simulação e versões

describe('simulationVersionService', () => {
  let simulationId: number;
  let versionId: number;
  const uniqueName = `Simulação para Versão ${Date.now()}`;

  beforeAll(async () => {
    // Cria uma simulação única para associar versões
    const sim = await simulationService.create(uniqueName);
    simulationId = sim.id;
  });

  afterAll(async () => {
    // Limpa simulação e versões
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
  });

  it('deve criar uma versão de simulação', async () => {
    const version = await simulationVersionService.create({
      simulationId,
      status: 'Vivo',
      startDate: new Date(),
      realRate: 4
    });
    expect(version).toHaveProperty('id');
    expect(version.simulationId).toBe(simulationId);
    versionId = version.id;
  });

  it('deve buscar todas as simulações com versões recentes', async () => {
    const all = await simulationService.getAllRecentVersions();
    expect(Array.isArray(all)).toBe(true);
    const sim = all.find((s: any) => s.id === simulationId);
    expect(sim).toBeDefined();
    expect(sim.versions.length).toBe(1);
    expect(sim.versions[0].id).toBe(versionId);
  });
});
