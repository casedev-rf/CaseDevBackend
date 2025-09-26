import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const simulationService = {
  async getAll() {
    return prisma.simulation.findMany();
  },

  async getById(id: number) {
    return prisma.simulation.findUnique({ where: { id } });
  },

  async create(name: string) {
    return prisma.simulation.create({ data: { name } });
  },

  async update(id: number, data: { name?: string | undefined }) {
    return prisma.simulation.update({ where: { id }, data });
  },

  async remove(id: number) {
    return prisma.simulation.delete({ where: { id } });
  },

  async projection(simulationId: number, status: 'Vivo' | 'Morto' | 'Inválido' = 'Vivo') {
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        versions: {
          orderBy: { startDate: 'desc' },
          take: 1,
          include: {
            allocations: true,
            events: true,
            insurances: true
          }
        }
      }
    });

    if (!simulation || simulation.versions.length === 0) return { error: 'Simulation/version not found' };

    const version = simulation.versions[0];
    const startYear = new Date(version.startDate).getFullYear();
    const endYear = 2060;
    const taxaReal = version.realRate ?? 4;

    // 1. Ponto inicial: valor dos ativos mais recentes antes da data de início
    let saldo = version.allocations.reduce((acc: number, alloc: { value: number }) => acc + alloc.value, 0);

    const projection = [];
    for (let year = startYear; year <= endYear; year++) {
      // 2. Entradas e saídas do ano
      let entradas = 0;
      let saidas = 0;

      version.events.forEach((event: { type: string; value: number }) => {
        // Exemplo: eventos do tipo 'entrada' ou 'saida', frequência, etc.
        if (event.type === 'entrada') entradas += event.value;
        if (event.type === 'saida') saidas += event.value;
      });

      // 3. Prêmios de seguros
      let premioSeguros = version.insurances.reduce((acc: number, ins: { premium?: number }) => acc + (ins.premium ?? 0) * 12, 0);

      // 4. Regras de status
      if (status === 'Morto') {
        entradas = 0;
        saidas = saidas / 2;
      }
      if (status === 'Inválido') {
        entradas = 0;
        // saidas normais
      }

      // 5. Atualiza saldo
      saldo = saldo + entradas - saidas - premioSeguros;
      saldo = saldo * (1 + taxaReal / 100);

      projection.push({ year, saldo });
    }

    return { simulationId, status, projection };
  },

  async duplicate(simulationId: number, newName: string) {
    // 1. Buscar simulação e dados relacionados
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        versions: {
          include: {
            allocations: true,
            events: true,
            insurances: true
          }
        }
      }
    });

    if (!simulation) return { error: 'Simulation not found' };

    // 2. Criar nova simulação
    const newSimulation = await prisma.simulation.create({
      data: { name: newName }
    });

    // 3. Copiar versões e entidades relacionadas
    for (const version of simulation.versions) {
      const newVersion = await prisma.simulationVersion.create({
        data: {
          simulationId: newSimulation.id,
          status: version.status,
          startDate: version.startDate,
          realRate: version.realRate,
          allocations: {
            create: version.allocations.map((a: {
              type: string;
              name: string;
              value: number;
              date: Date;
              hasFinancing?: boolean;
              financingStartDate?: Date;
              financingInstallments?: number;
              financingRate?: number;
              financingEntryValue?: number;
            }) => ({
              type: a.type,
              name: a.name,
              value: a.value,
              date: a.date,
              hasFinancing: a.hasFinancing,
              financingStartDate: a.financingStartDate,
              financingInstallments: a.financingInstallments,
              financingRate: a.financingRate,
              financingEntryValue: a.financingEntryValue
            }))
          },
          events: {
            create: version.events.map((e: {
              type: string;
              value: number;
              frequency: string;
              startDate: Date;
              endDate?: Date;
            }) => ({
              type: e.type,
              value: e.value,
              frequency: e.frequency,
              startDate: e.startDate,
              endDate: e.endDate
            }))
          },
          insurances: {
            create: version.insurances.map((i: {
              name: string;
              startDate: Date;
              durationMonths: number;
              premium: number;
              insuredValue: number;
            }) => ({
              name: i.name,
              startDate: i.startDate,
              durationMonths: i.durationMonths,
              premium: i.premium,
              insuredValue: i.insuredValue
            }))
          }
        }
      });
    }

    return { newSimulationId: newSimulation.id };
  }
};