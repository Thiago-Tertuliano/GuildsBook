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
  - [Fase 7: Features Extras (Opcional)](#fase-7-features-extras-opcional)
    - [✅ Tarefas](#-tarefas-7)
  - [📊 Progresso Geral](#-progresso-geral)
    - [Resumo por Fase](#resumo-por-fase)
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

- [x] **1.6** Criar schema - Clubes de Leitura
  - [x] Model `BookClub` (id, name, description, ownerId, isPublic, maxMembers, currentMembers, createdAt)
  - [x] Model `BookClubMember` (id, clubId, userId, role, joinedAt)
  - [x] Model `BookClubDiscussion` (id, clubId, bookId, title, content, scheduledDate, creatorId, createdAt)


- [x] **1.7** Finalizar schema
  - [x] Adicionar índices necessários
  - [x] Revisar relacionamentos e constraints
  - [x] Gerar primeira migration (`npx prisma migrate dev --name init`)
  - [x] Gerar Prisma Client (`npx prisma generate`)
  - [x] Testar conexão com banco

- [x] **1.8** Seed do banco (dados de teste)
  - [x] Criar script de seed (`prisma/seed.ts`)
  - [x] Adicionar alguns usuários de teste
  - [x] Adicionar alguns livros de exemplo
  - [x] Executar seed

**Tempo Estimado**: 4-6 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 2: Backend Base

**Objetivo**: Criar as APIs e lógica de negócio base do sistema.

### ✅ Tarefas

- [x] **2.1** Configurar Prisma Client
  - [x] Criar `src/lib/prisma.ts` (singleton do Prisma)
  - [x] Configurar para desenvolvimento e produção

- [x] **2.2** Criar utilities e helpers
  - [x] Criar `src/lib/api/` para funções utilitárias
  - [x] Criar tipos TypeScript (`src/types/`)
  - [x] Configurar validação com Zod

- [x] **2.3** API - Gestão de Livros
  - [x] `GET /api/books` - Listar livros (com paginação)
  - [x] `GET /api/books/[id]` - Detalhes de um livro
  - [x] `POST /api/books` - Criar livro manualmente
  - [x] `GET /api/books/search` - Buscar livros (título, autor, ISBN)

- [x] **2.4** Integração com API Externa (Google Books)
  - [x] Criar serviço para Google Books API
  - [x] Função para buscar livros na API externa
  - [x] Função para sincronizar dados da API externa com nosso BD
  - [x] Endpoint `GET /api/books/external-search`

- [x] **2.5** API - Biblioteca Pessoal
  - [x] `GET /api/user/books` - Listar livros do usuário
  - [x] `POST /api/user/books` - Adicionar livro à biblioteca
  - [x] `PUT /api/user/books/[bookId]` - Atualizar status/rating/review
  - [x] `DELETE /api/user/books/[bookId]` - Remover da biblioteca
  - [x] `GET /api/user/books/stats` - Estatísticas pessoais

- [x] **2.6** API - Reviews
  - [x] `GET /api/books/[bookId]/reviews` - Listar reviews de um livro
  - [x] `POST /api/books/[bookId]/reviews` - Criar review
  - [x] `PUT /api/reviews/[id]` - Atualizar review
  - [x] `DELETE /api/reviews/[id]` - Deletar review
  - [x] `POST /api/reviews/[id]/like` - Dar like em review

- [x] **2.7** API - Comentários
  - [x] `GET /api/reviews/[reviewId]/comments` - Listar comentários
  - [x] `POST /api/reviews/[reviewId]/comments` - Criar comentário
  - [x] `PUT /api/comments/[id]` - Atualizar comentário
  - [x] `DELETE /api/comments/[id]` - Deletar comentário

**Tempo Estimado**: 8-12 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 3: Autenticação

**Objetivo**: Implementar sistema de autenticação seguro.

### ✅ Tarefas

- [x] **3.1** Configurar NextAuth.js
  - [x] Instalar NextAuth.js (`npm install next-auth`)
  - [x] Configurar `src/app/api/auth/[...nextauth]/route.ts`
  - [x] Configurar providers (Email, Google OAuth)
  - [x] Criar adapter do Prisma para NextAuth

- [x] **3.2** Configurar banco para autenticação
  - [x] Atualizar schema Prisma (tabelas do NextAuth)
  - [x] Executar migration
  - [x] Testar login/logout

- [x] **3.3** Criar middleware de autenticação
  - [x] Middleware para proteger rotas
  - [x] Helpers para verificar sessão
  - [x] Tipos TypeScript para sessão

- [x] **3.4** Páginas de autenticação
  - [x] Página de login
  - [x] Página de erro de autenticação

- [x] **3.5** API - Perfil de Usuário
  - [x] `GET /api/user/profile` - Obter perfil
  - [x] `PUT /api/user/profile` - Atualizar perfil
  - [x] `GET /api/user/[id]` - Perfil público

**Tempo Estimado**: 4-6 horas  
**Prioridade**: 🔴 Crítica

---

## Fase 4: Frontend Base

**Objetivo**: Criar a interface base e componentes reutilizáveis.

### ✅ Tarefas

- [x] **4.1** Configurar Design System
  - [x] Configurar tema (cores, tipografia)
  - [x] Instalar componentes shadcn/ui essenciais
  - [x] Criar layout base (Header, Footer, Sidebar)
  - [x] Configurar modo escuro/claro (toggle básico)

- [x] **4.2** Criar componentes de layout
  - [x] `Header` - Navegação principal
  - [x] `Footer` - Rodapé
  - [x] `Sidebar` - Menu lateral (se necessário)
  - [x] `Layout` wrapper principal

- [x] **4.3** Criar componentes de UI base
  - [x] Botões e inputs
  - [x] Cards
  - [x] Modais/Dialogs
  - [x] Loading states
  - [x] Error states

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

## Fase 7: Features Extras (Opcional)

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

- **Fase 0**: ⬜ 3/3 tarefas concluídas
- **Fase 1**: ⬜ 10/10 tarefas concluídas
- **Fase 2**: ⬜ 7/7 tarefas concluídas
- **Fase 3**: ⬜ 0/5 tarefas concluídas
- **Fase 4**: ⬜ 0/5 tarefas concluídas
- **Fase 5**: ⬜ 0/6 tarefas concluídas
- **Fase 6**: ⬜ 0/7 tarefas concluídas
- **Fase 7 (Opcional)**: ⬜ 0/7 tarefas concluídas

**Total**: 20/50 tarefas principais concluídas

---

## 🚀 Deploy e Produção

- [ ] Configurar Railway
- [ ] Configurar PostgreSQL no Railway
- [ ] Configurar variáveis de ambiente
- [ ] Deploy inicial
- [ ] Configurar domínio personalizado
- [ ] Monitoramento e logs

---

**Bora pro desenvolvimento! 🎉📚**
