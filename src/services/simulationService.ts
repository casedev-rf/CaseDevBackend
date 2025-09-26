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
    const updateData: { name?: string } = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    return prisma.simulation.update({ where: { id }, data: updateData });
  },

  async remove(id: number) {
    const simulation = await prisma.simulation.findUnique({ where: { id } });
    if (!simulation) {
      return { error: 'Simulação não encontrada.' };
    }
    await prisma.simulation.delete({ where: { id } });
    return { message: `Simulação ${id} deletada com sucesso.` };
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

    if (!simulation || !simulation.versions || simulation.versions.length === 0) {
      return { error: 'Simulation/version not found' };
    }

    const version = simulation.versions[0];
    if (!version) return { error: 'Versão não encontrada' };

    const startYear = new Date(version.startDate).getFullYear();
    const endYear = 2060;
    const taxaReal = version.realRate ?? 4;

    // 1. Ponto inicial: valor dos ativos mais recentes antes da data de início
    const startDate = new Date(version.startDate);

    // Para cada ativo (nome), pegue o registro mais recente antes da data de início
    const allocations = (version.allocations ?? []) as any[];
    const events = (version.events ?? []) as any[];
    const insurances = (version.insurances ?? []) as any[];

    const ativosUnicos: string[] = Array.from(new Set(allocations.map((a: any) => a.name)));
    let saldo = ativosUnicos.reduce((acc: number, nomeAtivo: string) => {
      const registros = allocations
        .filter((a: any) => a.name === nomeAtivo && new Date(a.date) <= startDate)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (registros.length > 0) {
        return acc + registros[0].value;
      }
      return acc;
    }, 0);

    const projection = [];
      for (let year = startYear; year <= endYear; year++) {
        let entradas = 0;
        let saidas = 0;

        events.forEach((event: any) => {
          const eventStart = new Date(event.startDate).getFullYear();
          const eventEnd = event.endDate ? new Date(event.endDate).getFullYear() : endYear;

          if (year >= eventStart && year <= eventEnd) {
            if (event.type === 'entrada') {
              if (event.frequency === 'mensal') entradas += event.value * 12;
              else if (event.frequency === 'anual') entradas += event.value;
              else entradas += event.value;
            }
            if (event.type === 'saida') {
              if (event.frequency === 'mensal') saidas += event.value * 12;
              else if (event.frequency === 'anual') saidas += event.value;
              else saidas += event.value;
            }
          }
        });

        let premioSeguros = insurances.reduce((acc: number, ins: any) => {
          const inicio = new Date(ins.startDate).getFullYear();
          const fim = inicio + (ins.durationMonths ? Math.floor(ins.durationMonths / 12) : 0);
          if (year >= inicio && year <= fim) {
            return acc + (ins.premium ?? 0) * 12;
          }
          return acc;
        }, 0);

        // Regras de status
        if (status === 'Morto') {
          entradas = 0;
          saidas = saidas / 2;
        }
        if (status === 'Inválido') {
          entradas = 0;
          // saidas normais
        }

        saldo = saldo + entradas - saidas - premioSeguros;
        saldo = saldo * (1 + taxaReal / 100);

        projection.push({ year, saldo });
      }

    return { simulationId, status, projection };
  },

  async duplicate(simulationId: number, newName: string) {
    const existing = await prisma.simulation.findFirst({
      where: {
        name: newName,
        NOT: { id: simulationId }
      }
    });
    if (existing) return { error: 'Já existe uma simulação com esse nome.' };
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
          create: (version.allocations ?? []).map((a: any) => ({
            type: a.type,
            name: a.name,
            value: a.value,
            date: a.date,
            hasFinancing: a.hasFinancing ?? null,
            financingStartDate: a.financingStartDate ?? null,
            financingInstallments: a.financingInstallments ?? null,
            financingRate: a.financingRate ?? null,
            financingEntryValue: a.financingEntryValue ?? null
          }))
        },
        events: {
          create: (version.events ?? []).map((e: any) => ({
            type: e.type,
            value: e.value,
            frequency: e.frequency,
            startDate: e.startDate,
            endDate: e.endDate ?? null
          }))
        },
        insurances: {
          create: (version.insurances ?? []).map((i: any) => ({
            name: i.name,
            startDate: i.startDate,
            durationMonths: i.durationMonths,
            premium: i.premium,
            insuredValue: i.insuredValue
          }))
        },
      }
    });
  }
    return { newSimulationId: newSimulation.id };
  },

  async getAllRecentVersions() {
    // Busca todas as simulações
    const simulations = await prisma.simulation.findMany({
      include: {
        versions: {
          orderBy: { startDate: 'desc' }
        }
      }
      });
      // Para cada simulação, pega só a versão mais recente
      const result = simulations.map((sim: {
        versions: any[];
        [key: string]: any;
      }) => {
      const [latestVersion, ...legacyVersions] = (sim.versions ?? []);
      return {
        ...sim,
        versions: latestVersion ? [latestVersion] : [],
        legacyVersions
      };
    });
    return result;
  }, 
};