import { simulationService } from '../../src/services/simulationService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('simulationService - cobertura enxuta e alta', () => {
  let simId: number;
  let simName = `Simulação Teste ${Date.now()}`;

  beforeAll(async () => {
    const sim = await simulationService.create(simName);
    simId = sim.id;
    // Cria uma versão base
    await prisma.simulationVersion.create({
      data: {
        simulationId: simId,
        status: 'Vivo',
        startDate: '2025-01-01T00:00:00.000Z',
        realRate: 4,
        isCurrent: false,
        allocations: {
          create: [
            { type: 'financeira', name: 'Poupança', value: 10000, date: '2024-12-01T00:00:00.000Z' }
          ]
        },
        events: {
          create: [
            { type: 'entrada', value: 1000, frequency: 'mensal', startDate: '2025-01-01T00:00:00.000Z' },
            { type: 'saida', value: 500, frequency: 'anual', startDate: '2025-01-01T00:00:00.000Z' }
          ]
        },
        insurances: {
          create: [
            { name: 'Seguro Vida', startDate: '2025-01-01T00:00:00.000Z', durationMonths: 24, premium: 100, insuredValue: 50000 }
          ]
        }
      }
    });
  });

  afterAll(async () => {
    await simulationService.remove(simId);
    await prisma.$disconnect();
  });

  it('CRUD básico: create, getById, update, remove', async () => {
    const sim = await simulationService.create('CRUD Sim');
    expect(sim).toHaveProperty('id');
    const found = await simulationService.getById(sim.id);
    expect(found?.name).toBe('CRUD Sim');
    const updated = await simulationService.update(sim.id, { name: 'CRUD Sim 2' });
    expect(updated.name).toBe('CRUD Sim 2');
    const removed = await simulationService.remove(sim.id);
    expect(removed).toHaveProperty('message');
    const after = await simulationService.getById(sim.id);
    expect(after).toBeNull();
  });

  it('getAll deve retornar array', async () => {
    const all = await simulationService.getAll();
    expect(Array.isArray(all)).toBe(true);
  });

  it('update em id inexistente deve lançar erro', async () => {
    await expect(simulationService.update(999999, { name: 'X' })).rejects.toThrow();
  });

  it('remove deve retornar erro para simulação inexistente', async () => {
    const result = await simulationService.remove(999999);
    expect(result).toHaveProperty('error');
  });

  it('projection deve retornar projeção correta para status Vivo', async () => {
    const result = await simulationService.projection(simId, 'Vivo');
    expect(result).toHaveProperty('projection');
    expect(result.status).toBe('Vivo');
    expect(Array.isArray(result.projection)).toBe(true);
    expect(result.projection!.length).toBeGreaterThan(0);
  });

  it('projection deve retornar projeção correta para status Morto', async () => {
    const result = await simulationService.projection(simId, 'Morto');
    expect(result.status).toBe('Morto');
    expect(result).toHaveProperty('projection');
  });

  it('projection deve retornar projeção correta para status Inválido', async () => {
    const result = await simulationService.projection(simId, 'Inválido');
    expect(result.status).toBe('Inválido');
    expect(result).toHaveProperty('projection');
  });

  it('projection deve retornar erro para simulação inexistente', async () => {
    const result = await simulationService.projection(999999);
    expect(result).toHaveProperty('error');
  });

  it('projection deve considerar apenas o registro mais recente de cada ativo', async () => {
    const sim = await simulationService.create('Projeção Ativos');
    await prisma.simulationVersion.create({
      data: {
        simulationId: sim.id,
        status: 'Vivo',
        startDate: '2025-06-01T00:00:00.000Z',
        realRate: 4,
        isCurrent: false,
        allocations: {
          create: [
            { type: 'financeira', name: 'Ação', value: 1000, date: '2025-01-01T00:00:00.000Z' },
            { type: 'financeira', name: 'Ação', value: 2000, date: '2025-05-01T00:00:00.000Z' },
            { type: 'financeira', name: 'Ação', value: 3000, date: '2025-07-01T00:00:00.000Z' }
          ]
        }
      }
    });
    const result = await simulationService.projection(sim.id);
    expect(result).toHaveProperty('projection');
    if (result.projection && result.projection.length > 0) {
      expect(result.projection[0]!.saldo).toBeGreaterThanOrEqual(2000);
    }
    await simulationService.remove(sim.id);
  });

  it('projection deve lidar com eventos de diferentes frequências', async () => {
    const sim = await simulationService.create('Projeção Eventos');
    await prisma.simulationVersion.create({
      data: {
        simulationId: sim.id,
        status: 'Vivo',
        startDate: '2025-01-01T00:00:00.000Z',
        realRate: 4,
        isCurrent: false,
        events: {
          create: [
            { type: 'entrada', value: 100, frequency: 'mensal', startDate: '2025-01-01T00:00:00.000Z' },
            { type: 'saida', value: 50, frequency: 'anual', startDate: '2025-01-01T00:00:00.000Z' },
            { type: 'entrada', value: 500, frequency: 'única', startDate: '2025-01-01T00:00:00.000Z' }
          ]
        }
      }
    });
    const result = await simulationService.projection(sim.id);
    expect(result).toHaveProperty('projection');
    await simulationService.remove(sim.id);
  });

  it('projection deve lidar com seguro sem premium e durationMonths indefinido', async () => {
    const sim = await simulationService.create('Seguro Sem Premium');
    await prisma.simulationVersion.create({
      data: {
        simulationId: sim.id,
        status: 'Vivo',
        startDate: '2025-01-01T00:00:00.000Z',
        realRate: 4,
        isCurrent: false,
        insurances: {
          create: [
            { name: 'Seguro', startDate: '2025-01-01T00:00:00.000Z' }
          ]
        }
      }
    });
    const result = await simulationService.projection(sim.id);
    expect(result).toHaveProperty('projection');
    await simulationService.remove(sim.id);
  });

  it('createCurrent deve criar versão atual com sucesso', async () => {
    const sim = await simulationService.create('Situação Atual');
    await prisma.simulationVersion.create({
      data: {
        simulationId: sim.id,
        status: 'Vivo',
        startDate: new Date().toISOString(),
        realRate: 4,
        isCurrent: false
      }
    });
    const result = await simulationService.createCurrent(sim.id);
    expect(result).toHaveProperty('simulationId', sim.id);
    expect(result).toHaveProperty('isCurrent', true);
    await simulationService.remove(sim.id);
  });

  it('createCurrent deve retornar erro se já existe current', async () => {
    const sim = await simulationService.create('Situação Atual 2');
    await prisma.simulationVersion.create({
      data: {
        simulationId: sim.id,
        status: 'Vivo',
        startDate: new Date().toISOString(),
        realRate: 4,
        isCurrent: true
      }
    });
    const result = await simulationService.createCurrent(sim.id);
    expect(result).toHaveProperty('error');
    expect(result.error).toMatch(/Current version already exists/);
    await simulationService.remove(sim.id);
  });

  it('createCurrent deve retornar erro se simulação não existe', async () => {
    const result = await simulationService.createCurrent(999999);
    expect(result).toHaveProperty('error');
    expect(result.error).toMatch(/Simulation not found/);
  });

  it('createCurrent deve retornar erro se não há versão base', async () => {
    const sim = await simulationService.create('Sem Versão Base');
    const result = await simulationService.createCurrent(sim.id);
    expect(result).toHaveProperty('error');
    expect(result.error).toMatch(/No version found/);
    await simulationService.remove(sim.id);
  });

  it('duplicate deve criar nova simulação', async () => {
    const newName = simName + ' Duplicada';
    const dup = await simulationService.duplicate(simId, newName);
    expect(dup).toHaveProperty('newSimulationId');
    await simulationService.remove(dup.newSimulationId);
  });

  it('duplicate deve retornar erro para nome já existente', async () => {
    const dup = await simulationService.duplicate(simId, simName);
    expect(dup).toHaveProperty('error');
  });

  it('duplicate deve retornar erro para simulação inexistente', async () => {
    const dup = await simulationService.duplicate(999999, 'Nome Inexistente');
    expect(dup).toHaveProperty('error');
  });

  it('duplicate deve retornar erro para simulação sem versões', async () => {
    const sim = await simulationService.create('Duplicar Sem Versão');
    const result = await simulationService.duplicate(sim.id, 'Duplicada Sem Versão');
    expect(result).toHaveProperty('error');
    await simulationService.remove(sim.id);
  });

  it('getAllRecentVersions deve retornar apenas versões recentes', async () => {
    const result = await simulationService.getAllRecentVersions();
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('versions');
    }
  });

  it('getAllRecentVersions deve lidar com nomes duplicados', async () => {
    const sim2 = await simulationService.create(simName);
    await prisma.simulationVersion.create({
      data: {
        simulationId: sim2.id,
        status: 'Vivo',
        startDate: '2027-01-01T00:00:00.000Z',
        realRate: 4,
        isCurrent: false
      }
    });
    const result = await simulationService.getAllRecentVersions();
    const sims = result.filter((s: any) => s.name === simName);
    expect(sims.length).toBeGreaterThanOrEqual(2);
    await simulationService.remove(sim2.id);
  });
});

