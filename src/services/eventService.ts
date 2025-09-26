import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const eventService = {
  async getAll() {
    return prisma.event.findMany();
  },
  async getById(id: number) {
    return prisma.event.findUnique({ where: { id } });
  },
  async create(simulationId: number, data: any) {
    // Busca a versão mais recente da simulação
    const version = await prisma.simulationVersion.findFirst({
      where: { simulationId },
      orderBy: { startDate: 'desc' }
    });
    if (!version) return { error: 'Versão não encontrada' };
    return prisma.event.create({
      data: { ...data, simulationVersionId: version.id }
    });
  },
  async update(id: number, data: any) {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { error: 'Evento não encontrado.' };
    }
    return prisma.event.update({ where: { id }, data });
  },
  async remove(id: number) {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { error: 'Evento não encontrado.' };
    }
    await prisma.event.delete({ where: { id } });
    return { message: `Evento ${id} deletado com sucesso.` };
  }
};