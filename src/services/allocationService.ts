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
    const allocation = await prisma.allocation.findUnique({ where: { id } });
    if (!allocation) {
      return { error: 'Alocação não encontrada.' };
    }
    return prisma.allocation.update({ where: { id }, data });
  },
  async remove(id: number) {
    const allocation = await prisma.allocation.findUnique({ where: { id } });
    if (!allocation) {
      return { error: 'Alocação não encontrada.' };
    }
    await prisma.allocation.delete({ where: { id } });
    return { message: `Alocação ${id} deletada com sucesso.` };
  },

  async history(allocationId: number) {
    // Retorna todos os registros desse ativo (por nome, por exemplo)
    const allocation = await prisma.allocation.findUnique({ where: { id: allocationId } });
    if (!allocation) return { error: 'Alocação não encontrada' };
    return prisma.allocation.findMany({
      where: { name: allocation.name }
    });
  }
};