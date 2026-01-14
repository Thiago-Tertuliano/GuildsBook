import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
    
    // Testar uma query simples
    const userCount = await prisma.user.count();
    console.log(`📊 Total de usuários: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();