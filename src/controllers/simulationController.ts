import { FastifyRequest, FastifyReply } from 'fastify';
import { simulationCreateSchema } from '../schemas/simulationCreateSchema';
import { simulationService } from '../services/simulationService';
import { simulationUpdateSchema } from '../schemas/simulationUpdateSchema';

export const simulationController = {
  async createCurrent(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const result = await simulationService.createCurrent(id);
    if ('error' in result) {
      return reply.code(400).send(result);
    }
    return reply.code(201).send(result);
  },
  
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const simulations = await simulationService.getAll();
    return reply.send(simulations);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const simulation = await simulationService.getById(id);
    if (!simulation) return reply.code(404).send({ message: 'Simulation not found' });
    return reply.send(simulation);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const parseResult = simulationCreateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const simulation = await simulationService.create(parseResult.data.name);
    return reply.code(201).send(simulation);
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const parseResult = simulationUpdateSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({ error: parseResult.error.issues });
    }
    const id = Number(request.params.id);
    const result = await simulationService.update(id, parseResult.data);
    return reply.send(result);
  },

  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await simulationService.remove(id);
    return reply.code(204).send();
  },

  async projection(request: FastifyRequest<{ 
    Params: { id: string }, 
    Body: { status: 'Vivo' | 'Morto' | 'Inválido' } 
  }>, reply: FastifyReply) {
    console.log('🚀🚀🚀 CONTROLLER EXECUTANDO!!! 🚀🚀🚀');
    const id = Number(request.params.id);
    const { status } = request.body;
    
    console.log('🚀 CONTROLLER: Recebendo request de projeção:', { id, status, body: request.body, params: request.params });
    
    try {
      const result = await simulationService.projection(id, status);
      console.log('🚀 CONTROLLER: Resultado do service:', {
        hasResult: !!result,
        resultKeys: result ? Object.keys(result) : [],
        projectionLength: result?.projection?.length || 0,
        firstProjectionItem: result?.projection?.[0] || null
      });
      
      // 🔍 TESTE DE SERIALIZAÇÃO JSON
      if (result && result.projection && result.projection.length > 0) {
        const firstItem = result.projection[0];
        if (firstItem) {
          console.log('🔍 CONTROLLER: Primeiro objeto antes de enviar:');
          console.log('   - Keys:', Object.keys(firstItem));
          console.log('   - Values:', Object.values(firstItem));
          console.log('   - JSON.stringify:', JSON.stringify(firstItem));
          console.log('   - Objeto completo:', firstItem);
          
          // Teste de serialização/deserialização
          const testSerialization = JSON.stringify(firstItem);
          const testDeserialization = JSON.parse(testSerialization);
          console.log('🧪 CONTROLLER: Teste serialização/deserialização:');
          console.log('   - Serialized:', testSerialization);
          console.log('   - Deserialized keys:', Object.keys(testDeserialization));
          console.log('   - Deserialized values:', Object.values(testDeserialization));
        }
      }
      
      return reply.send(result);
    } catch (error) {
      console.error('❌ CONTROLLER: Erro ao gerar projeção:', error);
      return reply.code(500).send({ error: 'Erro interno do servidor' });
    }
  },

  async duplicate(
    request: FastifyRequest<{ Params: { id: string }; Body: { name: string } }>,
    reply: FastifyReply
  ) {
    const id = Number(request.params.id);
    const { name } = request.body;
    const result = await simulationService.duplicate(id, name);
    if ('error' in result) {
      return reply.code(409).send(result);
    }
    return reply.code(201).send(result);
  },
  
  async getAllRecent(request: FastifyRequest, reply: FastifyReply) {
    const simulations = await simulationService.getAllRecentVersions();
    return reply.send(simulations);
  },
};