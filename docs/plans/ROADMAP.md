# 🗺️ Roadmap de Desenvolvimento - GuildsBook

> **Status**: 🟡 Planejamento  
> **Última Atualização**: Janeiro 2025

Este roadmap foi criado para guiar o desenvolvimento do GuildsBook de forma organizada e progressiva. Cada etapa pode ser concluída em sessões de desenvolvimento, permitindo um progresso constante e mensurável.

---

## 📋 Índice

- [🗺️ Roadmap de Desenvolvimento - GuildsBook](#️-roadmap-de-desenvolvimento---guildsbook)
  - [📋 Índice](#-índice)
  - [Fase 0: Setup Inicial](#fase-0-setup-inicial)
    - [✅ Tarefas](#-tarefas)
  - [Fase 1: Banco de Dados](#fase-1-banco-de-dados)
    - [✅ Tarefas](#-tarefas-1)
  - [Fase 2: Backend Base](#fase-2-backend-base)
    - [✅ Tarefas](#-tarefas-2)
  - [Fase 3: Autenticação](#fase-3-autenticação)
    - [✅ Tarefas](#-tarefas-3)
  - [Fase 4: Frontend Base](#fase-4-frontend-base)
    - [✅ Tarefas](#-tarefas-4)
  - [Fase 5: MVP - Funcionalidades Core](#fase-5-mvp---funcionalidades-core)
    - [✅ Tarefas](#-tarefas-5)
  - [Fase 6: Comunidade e Recursos Avançados](#fase-6-comunidade-e-recursos-avançados)
    - [✅ Tarefas](#-tarefas-6)
  - [Fase 7: Features Extras](#fase-7-features-extras)
    - [✅ Tarefas](#-tarefas-7)
  - [📊 Progresso Geral](#-progresso-geral)
    - [Resumo por Fase](#resumo-por-fase)
  - [🎯 Próximos Passos Imediatos](#-próximos-passos-imediatos)
  - [📝 Notas de Desenvolvimento](#-notas-de-desenvolvimento)
  - [🚀 Deploy e Produção](#-deploy-e-produção)

---

## Fase 0: Setup Inicial

**Objetivo**: Preparar o ambiente de desenvolvimento e estrutura básica do projeto.

### ✅ Tarefas

- [x] **0.1** Criar repositório Git e estrutura inicial
  - [x] Inicializar Git repository
  - [x] Criar `.gitignore` adequado para Next.js/Node
  - [x] Criar estrutura de pastas básica

- [x] **0.2** Configurar projeto Next.js
  - [x] Executar `npx create-next-app@latest` com TypeScript
  - [x] Configurar Tailwind CSS
  - [x] Instalar e configurar shadcn/ui
  - [x] Configurar ESLint e Prettier

- [x] **0.3** Configurar ambiente de desenvolvimento
  - [x] Criar arquivo `.env.local` template
  - [x] Configurar variáveis de ambiente
  - [x] Testar build local do Next.js

**Tempo Estimado**: 1-2 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 1: Banco de Dados

**Objetivo**: Criar e configurar o esquema do banco de dados PostgreSQL usando Prisma.

### ✅ Tarefas

- [ ] **1.1** Configurar Prisma
  - [x] Instalar Prisma (`npm install prisma @prisma/client`)
  - [x] Inicializar Prisma (`npx prisma init`)
  - [x] Configurar conexão com PostgreSQL no `.env.local`

- [x] **1.2** Criar schema inicial (Entidades Core)
  - [x] Model `User` (id, email, name, avatar, bio, createdAt, location, preferences)
  - [x] Model `Book` (id, title, author, isbn, cover, genre, publishedYear, description, pages)
  - [x] Model `UserBook` (id, userId, bookId, status, rating, review, readDate, currentPage, createdAt)
  - [x] Definir relacionamentos básicos

- [x] **1.3** Criar schema - Sistema de Reviews
  - [x] Model `Review` (id, userId, bookId, content, rating, likes, createdAt, updatedAt)
  - [x] Model `Comment` (id, userId, reviewId, content, createdAt, updatedAt)
  - [x] Definir relacionamentos

- [x] **1.4** Criar schema - Listas e Organização
  - [x] Model `ReadingList` (id, userId, name, description, isPublic, createdAt)
  - [x] Model `ReadingListItem` (id, listId, bookId, order)
  - [x] Definir relacionamentos

- [x] **1.5** Criar schema - Comunidade
  - [x] Model `Follow` (id, followerId, followingId, createdAt)
  - [x] Model `Quote` (id, userId, bookId, content, page, chapter, isPublic, likes, createdAt)
  - [x] Model `Bookmark` (id, userId, bookId, page, note, createdAt)

- [ ] **1.6** Criar schema - Clubes de Leitura
  - [ ] Model `BookClub` (id, name, description, ownerId, isPublic, maxMembers, currentMembers, createdAt)
  - [ ] Model `BookClubMember` (id, clubId, userId, role, joinedAt)
  - [ ] Model `BookClubDiscussion` (id, clubId, bookId, title, content, scheduledDate, creatorId, createdAt)


- [ ] **1.7** Finalizar schema
  - [ ] Adicionar índices necessários
  - [ ] Revisar relacionamentos e constraints
  - [ ] Gerar primeira migration (`npx prisma migrate dev --name init`)
  - [ ] Gerar Prisma Client (`npx prisma generate`)
  - [ ] Testar conexão com banco

- [ ] **1.8** Seed do banco (dados de teste)
  - [ ] Criar script de seed (`prisma/seed.ts`)
  - [ ] Adicionar alguns usuários de teste
  - [ ] Adicionar alguns livros de exemplo
  - [ ] Executar seed

**Tempo Estimado**: 4-6 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 2: Backend Base

**Objetivo**: Criar as APIs e lógica de negócio base do sistema.

### ✅ Tarefas

- [ ] **2.1** Configurar Prisma Client
  - [ ] Criar `src/lib/prisma.ts` (singleton do Prisma)
  - [ ] Configurar para desenvolvimento e produção

- [ ] **2.2** Criar utilities e helpers
  - [ ] Criar `src/lib/api/` para funções utilitárias
  - [ ] Criar tipos TypeScript (`src/types/`)
  - [ ] Configurar validação com Zod

- [ ] **2.3** API - Gestão de Livros
  - [ ] `GET /api/books` - Listar livros (com paginação)
  - [ ] `GET /api/books/[id]` - Detalhes de um livro
  - [ ] `POST /api/books` - Criar livro manualmente
  - [ ] `GET /api/books/search` - Buscar livros (título, autor, ISBN)

- [ ] **2.4** Integração com API Externa (Google Books)
  - [ ] Criar serviço para Google Books API
  - [ ] Função para buscar livros na API externa
  - [ ] Função para sincronizar dados da API externa com nosso BD
  - [ ] Endpoint `GET /api/books/external-search`

- [ ] **2.5** API - Biblioteca Pessoal
  - [ ] `GET /api/user/books` - Listar livros do usuário
  - [ ] `POST /api/user/books` - Adicionar livro à biblioteca
  - [ ] `PUT /api/user/books/[bookId]` - Atualizar status/rating/review
  - [ ] `DELETE /api/user/books/[bookId]` - Remover da biblioteca
  - [ ] `GET /api/user/books/stats` - Estatísticas pessoais

- [ ] **2.6** API - Reviews
  - [ ] `GET /api/books/[bookId]/reviews` - Listar reviews de um livro
  - [ ] `POST /api/books/[bookId]/reviews` - Criar review
  - [ ] `PUT /api/reviews/[id]` - Atualizar review
  - [ ] `DELETE /api/reviews/[id]` - Deletar review
  - [ ] `POST /api/reviews/[id]/like` - Dar like em review

- [ ] **2.7** API - Comentários
  - [ ] `GET /api/reviews/[reviewId]/comments` - Listar comentários
  - [ ] `POST /api/reviews/[reviewId]/comments` - Criar comentário
  - [ ] `PUT /api/comments/[id]` - Atualizar comentário
  - [ ] `DELETE /api/comments/[id]` - Deletar comentário

**Tempo Estimado**: 8-12 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 3: Autenticação

**Objetivo**: Implementar sistema de autenticação seguro.

### ✅ Tarefas

- [ ] **3.1** Configurar NextAuth.js
  - [ ] Instalar NextAuth.js (`npm install next-auth`)
  - [ ] Configurar `src/app/api/auth/[...nextauth]/route.ts`
  - [ ] Configurar providers (Email, Google OAuth)
  - [ ] Criar adapter do Prisma para NextAuth

- [ ] **3.2** Configurar banco para autenticação
  - [ ] Atualizar schema Prisma (tabelas do NextAuth)
  - [ ] Executar migration
  - [ ] Testar login/logout

- [ ] **3.3** Criar middleware de autenticação
  - [ ] Middleware para proteger rotas
  - [ ] Helpers para verificar sessão
  - [ ] Tipos TypeScript para sessão

- [ ] **3.4** Páginas de autenticação
  - [ ] Página de login
  - [ ] Página de registro (se necessário)
  - [ ] Página de erro de autenticação

- [ ] **3.5** API - Perfil de Usuário
  - [ ] `GET /api/user/profile` - Obter perfil
  - [ ] `PUT /api/user/profile` - Atualizar perfil
  - [ ] `GET /api/user/[id]` - Perfil público

**Tempo Estimado**: 4-6 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 4: Frontend Base

**Objetivo**: Criar a interface base e componentes reutilizáveis.

### ✅ Tarefas

- [ ] **4.1** Configurar Design System
  - [ ] Configurar tema (cores, tipografia)
  - [ ] Instalar componentes shadcn/ui essenciais
  - [ ] Criar layout base (Header, Footer, Sidebar)
  - [ ] Configurar modo escuro/claro (toggle básico)

- [ ] **4.2** Criar componentes de layout
  - [ ] `Header` - Navegação principal
  - [ ] `Footer` - Rodapé
  - [ ] `Sidebar` - Menu lateral (se necessário)
  - [ ] `Layout` wrapper principal

- [ ] **4.3** Criar componentes de UI base
  - [ ] Botões e inputs
  - [ ] Cards
  - [ ] Modais/Dialogs
  - [ ] Loading states
  - [ ] Error states

- [ ] **4.4** Páginas estáticas base
  - [ ] Página inicial (Landing page simples)
  - [ ] Página 404
  - [ ] Página de erro

- [ ] **4.5** Configurar estado global (se necessário)
  - [ ] Configurar Zustand ou React Query
  - [ ] Hooks personalizados básicos
  - [ ] Context para tema

**Tempo Estimado**: 6-8 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 5: MVP - Funcionalidades Core

**Objetivo**: Implementar as funcionalidades mínimas para um produto viável.

### ✅ Tarefas

- [ ] **5.1** Página de Busca de Livros
  - [ ] Componente de busca
  - [ ] Integração com API (Google Books + BD local)
  - [ ] Lista de resultados
  - [ ] Página de detalhes do livro
  - [ ] Filtros básicos

- [ ] **5.2** Biblioteca Pessoal
  - [ ] Página principal da biblioteca
  - [ ] Grid/Lista de livros
  - [ ] Filtros por status (Quero Ler, Lendo, Lido)
  - [ ] Modal para adicionar livro
  - [ ] Ação de atualizar status/rating
  - [ ] Remover livro da biblioteca

- [ ] **5.3** Sistema de Avaliações
  - [ ] Componente de estrelas
  - [ ] Formulário de review
  - [ ] Visualização de reviews
  - [ ] Edição/exclusão de própria review

- [ ] **5.4** Página de Perfil
  - [ ] Visualização do próprio perfil
  - [ ] Edição de perfil
  - [ ] Estatísticas básicas (livros lidos, etc.)
  - [ ] Perfil público de outros usuários

- [ ] **5.5** Feed Básico
  - [ ] Lista de atividades recentes
  - [ ] Reviews de outros usuários
  - [ ] Atividades de usuários seguidos (se já tiver follow)

- [ ] **5.6** Testes e Ajustes MVP
  - [ ] Testar fluxo completo
  - [ ] Corrigir bugs
  - [ ] Melhorar UX
  - [ ] Responsividade mobile

**Tempo Estimado**: 12-16 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 6: Comunidade e Recursos Avançados

**Objetivo**: Adicionar funcionalidades de comunidade e recursos avançados.

### ✅ Tarefas

- [ ] **6.1** Sistema de Seguir Usuários
  - [ ] API para seguir/deixar de seguir
  - [ ] Lista de seguidores/seguindo
  - [ ] Botão de seguir no perfil
  - [ ] Feed de atividades de seguidos

- [ ] **6.2** Comentários em Reviews
  - [ ] Componente de comentários
  - [ ] Criar/editar/deletar comentários
  - [ ] Thread de comentários

- [ ] **6.3** Listas de Leitura
  - [ ] Criar listas personalizadas
  - [ ] Adicionar/remover livros de listas
  - [ ] Compartilhar listas
  - [ ] Visualizar listas públicas

- [ ] **6.4** Sistema de Citações
  - [ ] API para citações
  - [ ] Adicionar citação
  - [ ] Visualizar citações de um livro
  - [ ] Buscar citações
  - [ ] Compartilhar citações

- [ ] **6.5** Busca Avançada
  - [ ] Filtros avançados (ano, editora, idioma)
  - [ ] Busca por gênero
  - [ ] Ordenação de resultados
  - [ ] Salvar buscas favoritas

- [ ] **6.6** Estatísticas Detalhadas
  - [ ] Gráficos de livros lidos (por mês/ano)
  - [ ] Gêneros favoritos
  - [ ] Páginas lidas
  - [ ] Exportação de dados (CSV/JSON)

- [ ] **6.7** Clubes de Leitura (Básico)
  - [ ] Criar clube
  - [ ] Participar de clube
  - [ ] Fórum do clube
  - [ ] Lista de clubes públicos

**Tempo Estimado**: 16-20 horas  
**Prioridade**: 🟡 Importante

---

## Fase 7: Features Extras

**Objetivo**: Implementar funcionalidades avançadas e integrações.

### ✅ Tarefas

- [ ] **7.1** Marketplace de Livros
  - [ ] API para listagens
  - [ ] Criar anúncio de livro
  - [ ] Buscar livros por região
  - [ ] Sistema de transações
  - [ ] Avaliações de vendedores

- [ ] **7.2** Integrações com E-readers
  - [ ] API para sincronização
  - [ ] Integração com Kindle
  - [ ] Integração com Kobo
  - [ ] Importação de progresso

- [ ] **7.3** Importação do Goodreads
  - [ ] Interface para importar CSV
  - [ ] Parser de dados do Goodreads
  - [ ] Sincronização de reviews

- [ ] **7.4** Notificações
  - [ ] Sistema de notificações in-app
  - [ ] Email notifications (usando Resend)
  - [ ] Preferências de notificação

- [ ] **7.5** Desafios de Leitura
  - [ ] Criar desafios
  - [ ] Participar de desafios
  - [ ] Acompanhar progresso
  - [ ] Gamificação (badges, conquistas)

- [ ] **7.6** API Pública
  - [ ] Documentação da API (Swagger/OpenAPI)
  - [ ] Sistema de API keys
  - [ ] Rate limiting
  - [ ] Endpoints públicos

- [ ] **7.7** Otimizações e Performance
  - [ ] Otimização de imagens
  - [ ] Cache de queries
  - [ ] Lazy loading
  - [ ] SEO melhorado

**Tempo Estimado**: 20+ horas  
**Prioridade**: 🟢 Opcional

---

## 📊 Progresso Geral

### Resumo por Fase

- **Fase 0**: ⬜ 0/3 tarefas concluídas
- **Fase 1**: ⬜ 0/10 tarefas concluídas
- **Fase 2**: ⬜ 0/7 tarefas concluídas
- **Fase 3**: ⬜ 0/5 tarefas concluídas
- **Fase 4**: ⬜ 0/5 tarefas concluídas
- **Fase 5**: ⬜ 0/6 tarefas concluídas
- **Fase 6**: ⬜ 0/7 tarefas concluídas
- **Fase 7**: ⬜ 0/7 tarefas concluídas

**Total**: 0/50 tarefas principais concluídas

---

## 🎯 Próximos Passos Imediatos

1. ✅ **Criar este roadmap** (CONCLUÍDO!)
2. ⬜ Iniciar Fase 0 - Setup Inicial
3. ⬜ Configurar repositório Git
4. ⬜ Inicializar projeto Next.js

---

## 📝 Notas de Desenvolvimento

Use este espaço para anotações durante o desenvolvimento:

```
Data: __/__/____
Notas: 
```

---

## 🚀 Deploy e Produção

- [ ] Configurar Railway
- [ ] Configurar PostgreSQL no Railway
- [ ] Configurar variáveis de ambiente
- [ ] Deploy inicial
- [ ] Configurar domínio personalizado
- [ ] Monitoramento e logs

---

**Boa sorte com o desenvolvimento! 🎉📚**
