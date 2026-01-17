# 🏛️ GuildsBook

> Uma plataforma web moderna para bibliófilos e amantes da literatura compartilharem suas leituras, experiências e insights.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)](https://www.prisma.io/)

## 📋 Sobre o Projeto

O **GuildsBook** é uma plataforma web sofisticada dedicada à discussão literária de qualidade. Um espaço onde usuários podem descobrir novos títulos, avaliar obras, participar de conversas significativas e construir uma comunidade intelectual vibrante em torno dos livros.

### 🎯 Principais Funcionalidades

- 📚 **Gestão de Biblioteca Pessoal** - Organize seus livros com status de leitura (Quero Ler, Lendo, Lido)
- ⭐ **Sistema de Avaliações e Reviews** - Avalie livros com estrelas e reviews detalhadas
- 🔍 **Busca e Descoberta** - Busca avançada com integração ao Google Books API
- 👥 **Comunidade Intelectual** - Siga outros leitores, comente reviews e participe de discussões
- 📝 **Citações e Marcadores** - Salve e compartilhe suas citações favoritas
- 📖 **Listas de Leitura** - Crie listas personalizadas e compartilhe com a comunidade
- 🏛️ **Clubes de Leitura** - Crie e participe de clubes de leitura virtuais
- 📊 **Estatísticas Pessoais** - Acompanhe seus progressos de leitura com gráficos e relatórios
- 🌓 **Modo Escuro/Claro** - Interface adaptável ao seu preferência

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 16.1** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes UI reutilizáveis
- **React Query (TanStack Query)** - Gerenciamento de estado e cache

### Backend
- **Next.js API Routes** - API RESTful integrada
- **NextAuth.js v5** - Autenticação segura
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Banco de dados relacional

### Ferramentas
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código
- **Zod** - Validação de schemas

## 📁 Estrutura do Projeto

```
GuildsBook/
├── docs/                    # Documentação do projeto
│   ├── plans/              # Planos e roadmaps
│   └── tests/              # Documentação de testes
├── guildsbook-app/         # Aplicação Next.js principal
│   ├── prisma/             # Schema e migrations do banco
│   ├── public/             # Assets estáticos
│   └── src/
│       ├── app/            # Páginas e rotas (App Router)
│       ├── components/     # Componentes React
│       ├── lib/            # Utilitários e helpers
│       ├── hooks/          # Custom React hooks
│       └── types/          # Definições TypeScript
└── LICENSE                 # Licença do projeto
```

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** 18+ instalado
- **PostgreSQL** configurado e rodando
- **Git** para clonar o repositório

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd GuildsBook
```

2. **Instale as dependências**
```bash
cd guildsbook-app
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `example.env` para `.env.local` e preencha os valores:

```bash
cp example.env .env.local
```

Edite `.env.local` e configure:
- `DATABASE_URL` - URL de conexão do PostgreSQL
- `NEXTAUTH_URL` - URL base da aplicação
- `NEXTAUTH_SECRET` - Secret para JWT (gere com `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (opcional, para OAuth)
- `GOOGLE_BOOKS_API_KEY` (opcional, para busca de livros)

4. **Configure o banco de dados**

```bash
# Executar migrations
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# (Opcional) Popular banco com dados de teste
npm run db:seed
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📚 Documentação

- **[Plano do Projeto](./docs/plans/PROJETO.md)** - Visão geral completa do projeto
- **[Roadmap](./docs/plans/ROADMAP.md)** - Roadmap de desenvolvimento
- **[API Routes](./docs/tests/postman/ROUTES.md)** - Documentação das rotas da API
- **[README da Aplicação](./guildsbook-app/README.md)** - Documentação específica da aplicação

## 🧪 Scripts Disponíveis

Na pasta `guildsbook-app`:

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa o linter
- `npm run format` - Formata código com Prettier
- `npm run db:seed` - Popula banco com dados de teste

## 🗂️ Banco de Dados

O projeto utiliza **PostgreSQL** com **Prisma ORM**. O schema principal inclui:

- `User` - Usuários da plataforma
- `Book` - Catálogo de livros
- `UserBook` - Relacionamento usuário-livro (status, rating)
- `Review` - Reviews de livros
- `Comment` - Comentários em reviews
- `ReadingList` - Listas de leitura
- `Quote` - Citações salvas
- `BookClub` - Clubes de leitura
- `Follow` - Relacionamentos de seguir/seguido

Verifique `guildsbook-app/prisma/schema.prisma` para o schema completo.

## 🎨 Design e UX

A interface foi construída com foco em:
- **Design limpo e moderno** - Interface literária e elegante
- **Responsividade** - Funciona perfeitamente em mobile e desktop
- **Acessibilidade** - Seguindo padrões WCAG 2.1
- **Modo escuro/claro** - Tema adaptável às preferências do usuário
- **Performance** - Otimizações com Next.js SSR/SSG

## 🔐 Segurança

- Autenticação segura com NextAuth.js
- Validação de inputs com Zod
- Proteção contra XSS
- Variáveis sensíveis em `.env.local`
- CORS configurado adequadamente

## 📊 Status do Projeto

O projeto está em **ativo desenvolvimento**. Consulte o [Roadmap](./docs/plans/ROADMAP.md) para ver o progresso detalhado.

**Fases Concluídas:**
- ✅ Setup inicial
- ✅ Banco de dados
- ✅ Backend base
- ✅ Autenticação
- ✅ Frontend base
- ✅ MVP - Funcionalidades Core
- ✅ Comunidade e Recursos Avançados

**Próximas Fases:**
- 🔄 Marketplace de livros (opcional)
- 🔄 Integrações com e-readers (opcional)
- 🔄 Importação do Goodreads (opcional)
- 🔄 Sistema de notificações (opcional)

## 🤝 Contribuindo

Este é um projeto pessoal, mas feedback e sugestões são sempre bem-vindos!

## 📄 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](./LICENSE).

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para amantes de livros**
