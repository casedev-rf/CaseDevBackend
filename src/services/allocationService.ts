import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const allocationService = {
  async getAll() {
    return prisma.allocation.findMany();
  },
  async getById(id: number) {
    return prisma.allocation.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.allocation.create({ data });
  },
  async update(id: number, data: any) {
    return prisma.allocation.update({ where: { id }, data });
  },
  async remove(id: number) {
    return prisma.allocation.delete({ where: { id } });
  }
};