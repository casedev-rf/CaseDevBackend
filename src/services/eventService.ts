import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const eventService = {
  async getAll() {
    return prisma.event.findMany();
  },
  async getById(id: number) {
    return prisma.event.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.event.create({ data });
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