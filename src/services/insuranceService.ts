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
    try {
      // Converter startDate para DateTime ISO completo
      const processedData = {
        ...data,
        startDate: new Date(data.startDate + 'T00:00:00.000Z')
      };
      
      console.log('Creating insurance with data:', processedData);
      
      return await prisma.insurance.create({ data: processedData });
    } catch (error) {
      console.error('Error creating insurance:', error);
      throw error;
    }
  },
  async update(id: number, data: any) {
    try {
      const insurance = await prisma.insurance.findUnique({ where: { id } });
      if (!insurance) {
        return { error: 'Seguro não encontrado.' };
      }
      
      // Converter startDate para DateTime se for string
      const processedData = { ...data };
      if (data.startDate && typeof data.startDate === 'string') {
        processedData.startDate = new Date(data.startDate + 'T00:00:00.000Z');
      }
      
      return await prisma.insurance.update({ where: { id }, data: processedData });
    } catch (error) {
      console.error('Error updating insurance:', error);
      throw error;
    }
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