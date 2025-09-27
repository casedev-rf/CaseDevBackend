import { insuranceService } from '../../src/services/insuranceService';
import { simulationService } from '../../src/services/simulationService';
import { simulationVersionService } from '../../src/services/simulationVersionService';

describe('insuranceService', () => {
  let simulationId: number;
  let versionId: number;
  let insuranceId: number;
  const uniqueSimName = `Simulação Insurance ${Date.now()}`;

  beforeAll(async () => {
    // Cria simulação e versão para os seguros
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
    // Limpa seguro, versão e simulação
    if (insuranceId) await insuranceService.remove(insuranceId);
    if (versionId) await simulationVersionService.remove(versionId);
    if (simulationId) await simulationService.remove(simulationId);
  });

  it('deve criar um seguro', async () => {
    const insuranceData = {
      simulationVersionId: versionId,
      name: 'Seguro Teste',
      startDate: new Date(),
      durationMonths: 12,
      premium: 100,
      insuredValue: 10000
    };
    const insurance = await insuranceService.create(insuranceData);
    expect(insurance).toHaveProperty('id');
    expect(insurance.simulationVersionId).toBe(versionId);
    insuranceId = insurance.id;
  });

  it('deve buscar seguro por id', async () => {
    const insurance = await insuranceService.getById(insuranceId);
    expect(insurance).not.toBeNull();
    expect(insurance?.id).toBe(insuranceId);
  });

  it('deve atualizar seguro', async () => {
    const updated = await insuranceService.update(insuranceId, { premium: 200 });
    expect(updated.premium).toBe(200);
  });

  it('deve buscar todos os seguros', async () => {
    const all = await insuranceService.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.find((i: any) => i.id === insuranceId)).toBeDefined();
  });

  it('deve remover seguro', async () => {
    const removed = await insuranceService.remove(insuranceId);
    expect(removed).toHaveProperty('message');
    const after = await insuranceService.getById(insuranceId);
    expect(after).toBeNull();
    insuranceId = 0;
  });
});
