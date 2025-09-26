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

  async projection(simulationId: number) {
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
    const projection = simulation.versions.map((version: { id: number }) => {
      return {
        versionId: version.id,
        saldoFinal: 0 
      };
    });

    return { simulationId, projection };
  },
};