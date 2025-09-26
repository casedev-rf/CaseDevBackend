import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const simulationVersionService = {
  async getAll() {
    return prisma.simulationVersion.findMany();
  },
  async getById(id: number) {
    return prisma.simulationVersion.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.simulationVersion.create({ data });
  },
  async update(id: number, data: any) {
    const version = await prisma.simulationVersion.findUnique({ where: { id } });
    if (!version) {
      return { error: 'Versão não encontrada.' };
    }
    return prisma.simulationVersion.update({ where: { id }, data });
  },
  async remove(id: number) {
    const version = await prisma.simulationVersion.findUnique({ where: { id } });
    if (!version) {
      return { error: 'Versão não encontrada.' };
    }
    await prisma.simulationVersion.delete({ where: { id } });
    return { message: `Versão ${id} deletada com sucesso.` };
  }
};