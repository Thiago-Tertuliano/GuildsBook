# 📱 GuildsBook App

Aplicação Next.js principal do projeto GuildsBook - uma plataforma social para bibliófilos.

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18 ou superior
- **PostgreSQL** configurado e rodando
- **npm** ou **yarn** ou **pnpm**

### Instalação

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**

Copie o arquivo `example.env` para `.env.local`:

```bash
cp example.env .env.local
```

Edite `.env.local` e configure as variáveis necessárias (veja [Variáveis de Ambiente](#-variáveis-de-ambiente)).

3. **Configurar banco de dados**

```bash
# Executar migrations
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# (Opcional) Popular com dados de teste
npm run db:seed
```

4. **Iniciar servidor de desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📋 Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia o servidor de desenvolvimento em `http://localhost:3000`
- `npm run build` - Cria build de produção otimizado
- `npm run start` - Inicia servidor de produção (requer build primeiro)

### Qualidade de Código

- `npm run lint` - Executa o ESLint para verificar problemas no código
- `npm run format` - Formata o código automaticamente com Prettier
- `npm run format:check` - Verifica se o código está formatado (usado em CI)

### Banco de Dados

- `npm run db:seed` - Popula o banco de dados com dados de teste

## ⚙️ Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.local`:

### Obrigatórias

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@host:porta/database"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui" # Gere com: openssl rand -base64 32
```

### Opcionais (mas recomendadas)

```env
# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# APIs Externas
GOOGLE_BOOKS_API_KEY="" # Para busca de livros via Google Books API
```

Veja `example.env` para mais detalhes sobre cada variável.

## 📁 Estrutura do Projeto

```
guildsbook-app/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   ├── migrations/        # Migrations do Prisma
│   └── seed.ts            # Script para popular banco
├── public/                # Assets estáticos (imagens, vídeos)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API Routes
│   │   │   ├── auth/      # Rotas de autenticação (NextAuth)
│   │   │   ├── books/     # Endpoints de livros
│   │   │   ├── reviews/   # Endpoints de reviews
│   │   │   ├── clubs/     # Endpoints de clubes
│   │   │   └── ...        # Outras rotas da API
│   │   ├── (dashboard)/   # Layout para área autenticada
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── books/         # Páginas de livros
│   │   ├── profile/       # Páginas de perfil
│   │   └── ...            # Outras páginas
│   ├── components/        # Componentes React
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   ├── *.tsx          # Componentes específicos
│   ├── lib/               # Utilitários e helpers
│   │   ├── api/           # Clientes e helpers de API
│   │   ├── auth.ts        # Configuração NextAuth
│   │   ├── prisma.ts      # Cliente Prisma singleton
│   │   └── utils.ts       # Funções utilitárias
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   ├── types/             # Definições TypeScript
│   └── middleware.ts      # Next.js middleware
├── .env.local             # Variáveis de ambiente (não versionado)
├── next.config.ts         # Configuração do Next.js
├── tsconfig.json          # Configuração TypeScript
└── package.json           # Dependências e scripts
```

## 🛠️ Tecnologias Utilizadas

### Core
- **[Next.js 16.1](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI acessíveis

### Backend & Database
- **[Prisma](https://www.prisma.io/)** - ORM type-safe
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[NextAuth.js v5](https://next-auth.js.org/)** - Autenticação

### Estado & Data Fetching
- **[TanStack Query (React Query)](https://tanstack.com/query)** - Gerenciamento de estado servidor
- **[Zod](https://zod.dev/)** - Validação de schemas

### Utilitários
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[lucide-react](https://lucide.dev/)** - Ícones
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Tema escuro/claro

## 🗄️ Banco de Dados

O projeto usa **PostgreSQL** com **Prisma ORM**. O schema está definido em `prisma/schema.prisma`.

### Principais Models

- `User` - Usuários da plataforma
- `Book` - Catálogo de livros
- `UserBook` - Relacionamento usuário-livro (status, rating)
- `Review` - Reviews de livros
- `Comment` - Comentários em reviews
- `ReadingList` - Listas de leitura personalizadas
- `Quote` - Citações salvas dos livros
- `BookClub` - Clubes de leitura
- `Follow` - Relacionamentos de seguir/seguido

### Comandos Úteis do Prisma

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Ver dados no Prisma Studio (GUI)
npx prisma studio

# Gerar Prisma Client após mudanças no schema
npx prisma generate

# Reset do banco (⚠️ cuidado: apaga todos os dados)
npx prisma migrate reset
```

## 🔐 Autenticação

O projeto usa **NextAuth.js v5** com suporte a:

- **Email** - Autenticação via email (magic link)
- **Google OAuth** - Login com conta Google (opcional)
- **GitHub OAuth** - Login com conta GitHub (opcional)

A configuração está em `src/lib/auth.ts` e as rotas em `src/app/api/auth/[...nextauth]/route.ts`.

## 📡 API Routes

As API routes estão em `src/app/api/`. Principais endpoints:

- `/api/books` - CRUD de livros
- `/api/books/[bookId]/reviews` - Reviews de livros
- `/api/reviews/[reviewId]` - Gerenciar reviews
- `/api/user/books` - Biblioteca pessoal do usuário
- `/api/clubs` - Clubes de leitura
- `/api/quotes` - Citações
- `/api/reading-lists` - Listas de leitura

Consulte `docs/tests/postman/ROUTES.md` para documentação completa da API.

## 🎨 Componentes

### Componentes UI Base (shadcn/ui)

Componentes reutilizáveis em `src/components/ui/`:
- `button` - Botões estilizados
- `card` - Cards para conteúdo
- `dialog` - Modais e dialogs
- `input` - Campos de formulário
- `avatar` - Avatar de usuário
- `dropdown-menu` - Menus dropdown

### Componentes Específicos

Componentes específicos da aplicação em `src/components/`:
- `header` - Cabeçalho da aplicação
- `sidebar` - Menu lateral
- `book-list` - Lista de livros
- `review-card` - Card de review
- `quote-card` - Card de citação
- E muitos outros...

## 🧩 Hooks Customizados

Hooks reutilizáveis em `src/hooks/`:

- `use-auth.ts` - Hook para autenticação
- `use-api.ts` - Hook para chamadas de API
- `use-theme.ts` - Hook para tema (escuro/claro)
- `use-saved-searches.ts` - Hook para buscas salvas

## 🧪 Desenvolvimento

### Adicionar Novo Componente

1. Crie o componente em `src/components/`
2. Se for componente base, use `src/components/ui/` (shadcn/ui)
3. Exporte se necessário em um index

### Adicionar Nova Rota de API

1. Crie arquivo `route.ts` em `src/app/api/[rota]/`
2. Exporte funções `GET`, `POST`, `PUT`, `DELETE`, etc.
3. Use Prisma Client para acessar banco
4. Valide dados com Zod

### Adicionar Nova Página

1. Crie arquivo `page.tsx` em `src/app/[rota]/`
2. Use componentes existentes quando possível
3. Para páginas autenticadas, use layout `(dashboard)`

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se PostgreSQL está rodando
- Confirme `DATABASE_URL` no `.env.local`
- Teste conexão: `npx prisma studio`

### Erro de autenticação

- Verifique `NEXTAUTH_URL` e `NEXTAUTH_SECRET` no `.env.local`
- Certifique-se que as migrations do NextAuth foram executadas
- Limpe cookies do navegador

### Erro de build

- Execute `npx prisma generate` antes de buildar
- Verifique se todas as variáveis de ambiente estão configuradas
- Limpe `.next` e `node_modules`, reinstale: `rm -rf .next node_modules && npm install`

## 📚 Documentação Adicional

- **[README Principal](../README.md)** - Visão geral do projeto
- **[Documentação](./docs/)** - Documentos e roadmaps
- **[Next.js Docs](https://nextjs.org/docs)** - Documentação oficial Next.js
- **[Prisma Docs](https://www.prisma.io/docs)** - Documentação oficial Prisma

## 🚢 Deploy

### Preparação para Produção

1. Configure variáveis de ambiente no ambiente de produção
2. Execute `npm run build` para verificar build
3. Execute migrations no banco de produção: `npx prisma migrate deploy`

### Recomendações

- Use PostgreSQL gerenciado (Railway, Vercel Postgres, etc.)
- Configure `NEXTAUTH_URL` para URL de produção
- Use HTTPS em produção
- Configure variáveis de ambiente adequadamente

## 📝 Licença

Este projeto está sob a mesma licença do projeto principal.

---

**Desenvolvido com Next.js e React** ❤️
