import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const simulationService = {
  async projection(simulationId: number, status: 'Vivo' | 'Morto' | 'Inválido') {
    console.log('🔍 SERVICE: Iniciando cálculo de projeção:', { simulationId, status });
    
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            allocations: true,
            events: true,
            insurances: true,
          }
        }
      }
    });

    console.log('🔍 SERVICE: Simulação encontrada:', {
      hasSimulation: !!simulation,
      versionsCount: simulation?.versions?.length || 0,
      firstVersionId: simulation?.versions?.[0]?.id || null,
      firstVersionData: simulation?.versions?.[0] ? {
        id: simulation.versions[0].id,
        startDate: simulation.versions[0].startDate,
        realRate: simulation.versions[0].realRate,
        allocationsCount: simulation.versions[0].allocations?.length || 0,
        eventsCount: simulation.versions[0].events?.length || 0,
        insurancesCount: simulation.versions[0].insurances?.length || 0
      } : null
    });

    if (!simulation || !simulation.versions.length) {
      console.log('❌ SERVICE: Simulação ou versão não encontrada');
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

    console.log('🔍 SERVICE: Dados extraídos:', {
      startYear,
      endYear,
      taxaReal,
      allocationsCount: allocations.length,
      eventsCount: events.length,
      insurancesCount: insurances.length,
      startDate: startDate.toISOString()
    });

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

    console.log('🔍 SERVICE: Saldo inicial calculado:', {
      ativosUnicos,
      saldoInicial: saldo,
      ativosUnicosCount: ativosUnicos.length
    });

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
        const entradaOriginal = entradas;
        const saidaOriginal = saidas;
        
        if (status === 'Morto') {
          entradas = 0;
          saidas = saidas / 2;
          
          // Log para verificar aplicação da regra
          if (year === startYear || year === startYear + 10 || year === startYear + 20) {
            console.log(`💀 MORTO - Ano ${year}:`, {
              'Entrada original': entradaOriginal,
              'Entrada aplicada': entradas,
              'Saída original': saidaOriginal,
              'Saída aplicada': saidas,
              'Saldo antes': saldo
            });
          }
        }
        if (status === 'Inválido') {
          entradas = 0;
          // saidas normais
          
          // Log para verificar aplicação da regra
          if (year === startYear || year === startYear + 10 || year === startYear + 20) {
            console.log(`♿ INVÁLIDO - Ano ${year}:`, {
              'Entrada original': entradaOriginal,
              'Entrada aplicada': entradas,
              'Saída original': saidaOriginal,
              'Saída aplicada': saidas,
              'Saldo antes': saldo
            });
          }
        }
        
        // Log para status VIVO nos mesmos anos para comparação
        if (status === 'Vivo' && (year === startYear || year === startYear + 10 || year === startYear + 20)) {
          console.log(`✅ VIVO - Ano ${year}:`, {
            'Entrada': entradas,
            'Saída': saidas,
            'Saldo antes': saldo
          });
        }

        saldo = saldo + entradas - saidas - premioSeguros;
        saldo = saldo * (1 + taxaReal / 100);

        // Calcular divisão por tipo de ativo (estimativa)
        const totalPatrimony = Math.round(saldo);
        const financialPatrimony = Math.round(saldo * 0.7); // 70% financeiro
        const immobilizedPatrimony = Math.round(saldo * 0.3); // 30% imobilizado
        const totalWithoutInsurance = Math.round(saldo * 0.9); // 90% sem seguros

        const projectionItem = { 
          year, 
          totalPatrimony,
          financialPatrimony,
          immobilizedPatrimony,
          totalWithoutInsurance
        };
        
        // Debug: verificar dados antes de adicionar
        if (year === startYear) {
          console.log('🔍 Backend Debug - Primeiro item da projeção:', projectionItem);
          console.log('🔍 Backend Debug - Valores calculados:', {
            saldo: saldo.toFixed(2),
            entradas,
            saidas,
            premioSeguros,
            taxaReal
          });
        }
        
        projection.push(projectionItem);
      }

    console.log('🔍 Backend Debug - Retorno final:', {
      simulationId,
      status,
      projectionLength: projection.length,
      firstProjectionItem: projection[0],
      lastProjectionItem: projection[projection.length - 1]
    });

    return { simulationId, status, projection };
  },

  async createCurrent(simulationId: number) {
    // Busca a simulação principal (menor ID entre as mais recentes de cada nome)
    const allSimulations = await prisma.simulation.findMany({
      include: {
        versions: {
          orderBy: { startDate: 'desc' },
          include: {
            allocations: true,
            events: true,
            insurances: true
          }
        }
      }
    });
    const target = allSimulations.find((s: any) => s.id === simulationId);
    if (!target) return { error: 'Simulation not found' };
    // Verifica se já existe uma versão "current" para essa simulação
    const alreadyCurrent = target.versions.find((v: any) => v.isCurrent);
    if (alreadyCurrent) return { error: 'Current version already exists for this simulation.' };

    // Cria uma nova versão com data de início = hoje, status = "Vivo", flag isCurrent
    const today = new Date();
    const latestVersion = target.versions[0];
    if (!latestVersion) return { error: 'No version found to base current situation.' };

    await prisma.simulationVersion.create({
      data: {
        simulationId: target.id,
        status: 'Vivo',
        startDate: today.toISOString(),
        realRate: latestVersion.realRate,
        isCurrent: true,
        allocations: {
          create: (latestVersion.allocations ?? []).map((a: any) => ({
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
          create: (latestVersion.events ?? []).map((e: any) => ({
            type: e.type,
            value: e.value,
            frequency: e.frequency,
            startDate: e.startDate,
            endDate: e.endDate ?? null
          }))
        },
        insurances: {
          create: (latestVersion.insurances ?? []).map((i: any) => ({
            name: i.name,
            startDate: i.startDate,
            durationMonths: i.durationMonths,
            premium: i.premium,
            insuredValue: i.insuredValue
          }))
        }
      }
    });
    return { simulationId: target.id, isCurrent: true };
  },
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
    // Deleta todas as versões antes de deletar a simulação
    await prisma.simulationVersion.deleteMany({ where: { simulationId: id } });
    await prisma.simulation.delete({ where: { id } });
    return { message: `Simulação ${id} deletada com sucesso.` };
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
  }
};