import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar dados existentes (opcional - cuidado em produção!)
  // await prisma.user.deleteMany();
  // await prisma.book.deleteMany();

  // Criar usuários de teste
  const user1 = await prisma.user.upsert({
    where: { email: 'joao@example.com' },
    update: {},
    create: {
      email: 'joao@example.com',
      name: 'João Silva',
      bio: 'Amante de literatura clássica e ficção científica.',
      location: 'São Paulo, Brasil',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      name: 'Maria Santos',
      bio: 'Lendo sempre! Adoro romance e fantasia.',
      location: 'Rio de Janeiro, Brasil',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'pedro@example.com' },
    update: {},
    create: {
      email: 'pedro@example.com',
      name: 'Pedro Oliveira',
      bio: 'Entusiasta de livros técnicos e biografias.',
    },
  });

  console.log('✅ Usuários criados:', { user1: user1.email, user2: user2.email, user3: user3.email });

  // Criar livros de exemplo
  const book1 = await prisma.book.upsert({
    where: { isbn: '9788535914849' },
    update: {},
    create: {
      title: '1984',
      author: 'George Orwell',
      isbn: '9788535914849',
      genre: 'Ficção Distópica',
      publishedYear: 1949,
      pages: 416,
      description: 'Uma das obras mais influentes do século XX, 1984 é uma distopia que retrata um regime totalitário.',
    },
  });

  const book2 = await prisma.book.upsert({
    where: { isbn: '9788535918038' },
    update: {},
    create: {
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      author: 'J.R.R. Tolkien',
      isbn: '9788535918038',
      genre: 'Fantasia',
      publishedYear: 1954,
      pages: 576,
      description: 'O primeiro volume da trilogia épica de Tolkien.',
    },
  });

  const book3 = await prisma.book.upsert({
    where: { isbn: '9788535914870' },
    update: {},
    create: {
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      isbn: '9788535914870',
      genre: 'Literatura Infantil',
      publishedYear: 1943,
      pages: 96,
      description: 'Uma obra atemporal sobre amizade, amor e humanidade.',
    },
  });

  const book4 = await prisma.book.upsert({
    where: { isbn: '9788535919479' },
    update: {},
    create: {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      isbn: '9788535919479',
      genre: 'Romance',
      publishedYear: 1899,
      pages: 256,
      description: 'Um dos maiores clássicos da literatura brasileira.',
    },
  });

  console.log('✅ Livros criados:', { 
    book1: book1.title, 
    book2: book2.title, 
    book3: book3.title,
    book4: book4.title 
  });

  // Adicionar livros à biblioteca dos usuários
  await prisma.userBook.createMany({
    data: [
      {
        userId: user1.id,
        bookId: book1.id,
        status: 'LIDO',
        rating: 5,
      },
      {
        userId: user1.id,
        bookId: book2.id,
        status: 'LENDO',
        currentPage: 250,
      },
      {
        userId: user2.id,
        bookId: book3.id,
        status: 'LIDO',
        rating: 5,
      },
      {
        userId: user2.id,
        bookId: book4.id,
        status: 'QUERO_LER',
      },
      {
        userId: user3.id,
        bookId: book1.id,
        status: 'LIDO',
        rating: 4,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ UserBooks criados');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });