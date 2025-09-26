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
    return prisma.event.update({ where: { id }, data });
  },
  async remove(id: number) {
    return prisma.event.delete({ where: { id } });
  }
};