import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const insuranceService = {
  async getAll() {
    return prisma.insurance.findMany();
  },
  async getById(id: number) {
    return prisma.insurance.findUnique({ where: { id } });
  },
  async create(data: any) {
    return prisma.insurance.create({ data });
  },
  async update(id: number, data: any) {
    const insurance = await prisma.insurance.findUnique({ where: { id } });
    if (!insurance) {
      return { error: 'Seguro não encontrado.' };
    }
    return prisma.insurance.update({ where: { id }, data });
  },
  async remove(id: number) {
    const insurance = await prisma.insurance.findUnique({ where: { id } });
    if (!insurance) {
      return { error: 'Seguro não encontrado.' };
    }
    await prisma.insurance.delete({ where: { id } });
    return { message: `Seguro ${id} deletado com sucesso.` };
  }
};