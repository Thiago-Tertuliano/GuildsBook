# 🏛️ GuildsBook 

## Visão Geral

Uma plataforma web moderna e sofisticada para bibliófilos e amantes da literatura compartilharem suas leituras, experiências e insights. Um espaço dedicado à discussão literária de qualidade, onde usuários podem descobrir novos títulos, avaliar obras, participar de conversas significativas e construir uma comunidade intelectual vibrante em torno dos livros.

## 🎯 Objetivos do Projeto

### Principais Funcionalidades

1. **Gestão de Biblioteca Pessoal**
   - Adicionar livros à biblioteca pessoal
   - Marcar status de leitura (Quero Ler, Lendo, Lido)
   - Organizar por gêneros, autores e tags personalizadas

2. **Sistema de Avaliações e Reviews**
   - Sistema de estrelas (1-5)
   - Reviews detalhadas com formatação rica
   - Likes e comentários em reviews

3. **Busca e Descoberta**
   - Busca por título, autor, ISBN, gênero
   - Integração com APIs de livros (Google Books API / Open Library)
   - Recomendações personalizadas baseadas em preferências
   - Filtros avançados (ano, editora, idioma, etc.)

4. **Comunidade Intelectual**
   - Comentários em livros e reviews
   - Discussões e threads sobre temas literários
   - Seguir outros leitores
   - Feed de atividades da comunidade

5. **Recursos Adicionais**
   - Listas de leitura personalizadas
   - Desafios de leitura
   - Estatísticas pessoais (livros lidos, páginas lidas, gêneros favoritos)
   - Exportação de dados em formato CSV/JSON
   - Modo escuro/claro

6. **Sistema de Citações e Marcadores**
   - Salvar e organizar citações favoritas dos livros
   - Marcar páginas e trechos importantes durante a leitura
   - Compartilhar citações com a comunidade
   - Busca por citações por autor, livro ou tema
   - Exportação de citações em formatos diversos (PDF, EPUB, TXT)

7. **Clubes de Leitura Virtuais**
   - Criar e participar de clubes de leitura
   - Discussões agendadas e moderadas
   - Votação coletiva para escolha de livros
   - Fóruns dedicados por clube
   - Calendário de eventos e encontros virtuais
   - Sistema de debates estruturados

8. **Marketplace e Trocas Literárias**
   - Compra, venda e troca de livros físicos entre usuários
   - Sistema de avaliação de vendedores
   - Busca por livros disponíveis por região/cidade
   - Notificações de livros desejados disponíveis
   - Histórico de transações
   - Sistema de segurança e confiança

9. **Integração com Dispositivos e Apps de Leitura**
   - Sincronização com Kindle, Kobo e outros e-readers
   - Importação automática de progresso de leitura
   - Integração com Goodreads (importação de dados)
   - Sincronização com apps mobile (Apple Books, Google Play Books)
   - API aberta para integrações futuras

## 🛠 Stack Tecnológica Recomendada

### Front-end
- **Framework**: Next.js 14+ (React com App Router)
  - SSR/SSG para melhor performance
  - SEO otimizado
  - API Routes integradas
- **Styling**: Tailwind CSS + shadcn/ui
  - Design system consistente
  - Componentes reutilizáveis
  - Responsivo por padrão
- **Estado**: Zustand ou React Query
  - Gerenciamento de estado simples
  - Cache e sincronização de servidor

### Back-end
- **Runtime**: Node.js com Next.js API Routes
  - Arquitetura full-stack unificada
  - Deploy simplificado no Railway
- **Autenticação**: NextAuth.js / Auth.js
  - Múltiplos providers (Google, GitHub, Email)
  - Sessões seguras

### Banco de Dados
- **Principal**: PostgreSQL
  - Relacional, robusto e escalável
  - Suportado nativamente pelo Railway
  - ORM: Prisma
    - Type-safe queries
    - Migrations automáticas
    - Schema intuitivo

### APIs Externas
- **Google Books API** ou **Open Library API**
  - Busca e metadados de livros
  - Capas e informações adicionais

### Hospedagem e Deploy
- **Railway**
  - Deploy automático via Git
  - Banco PostgreSQL integrado
  - SSL automático
  - Domínio personalizado

### Ferramentas Adicionais
- **Upload de Imagens**: Cloudinary ou Railway Volumes
- **Email**: Resend ou SendGrid (para notificações)
- **Analytics**: Vercel Analytics ou Plausible

## 📊 Estrutura do Banco de Dados

### Principais Entidades

```
User
  - id, email, name, avatar, bio, createdAt, location, preferences

Book
  - id, title, author, isbn, cover, genre, publishedYear, description, pages

UserBook
  - id, userId, bookId, status, rating, review, readDate, currentPage, createdAt

Review
  - id, userId, bookId, content, rating, likes, createdAt, updatedAt

Comment
  - id, userId, reviewId, content, createdAt, updatedAt

ReadingList
  - id, userId, name, description, isPublic, createdAt

ReadingListItem
  - id, listId, bookId, order

Follow
  - id, followerId, followingId, createdAt

Quote
  - id, userId, bookId, content, page, chapter, isPublic, likes, createdAt

Bookmark
  - id, userId, bookId, page, note, createdAt

BookClub
  - id, name, description, ownerId, isPublic, maxMembers, currentMembers, createdAt

BookClubMember
  - id, clubId, userId, role, joinedAt

BookClubDiscussion
  - id, clubId, bookId, title, content, scheduledDate, creatorId, createdAt

BookListing
  - id, userId, bookId, condition, price, currency, location, isAvailable, createdAt

Transaction
  - id, listingId, buyerId, sellerId, status, createdAt, completedAt

DeviceSync
  - id, userId, deviceType, deviceId, lastSync, syncToken
```

## 🚀 Roadmap de Desenvolvimento

### Fase 1: MVP (Mínimo Produto Viável)
- [ ] Estrutura base do projeto (Next.js + Prisma + PostgreSQL)
- [ ] Sistema de autenticação
- [ ] CRUD de livros (busca via API + adicionar manualmente)
- [ ] Biblioteca pessoal (adicionar, remover, marcar status)
- [ ] Sistema básico de avaliações

### Fase 2: Funcionalidades Core
- [ ] Sistema de reviews completo
- [ ] Comentários em reviews
- [ ] Busca avançada de livros
- [ ] Perfil de usuário
- [ ] Feed de atividades

### Fase 3: Comunidade
- [ ] Sistema de seguir usuários
- [ ] Discussões e threads
- [ ] Listas de leitura compartilhadas
- [ ] Recomendações baseadas em comportamento

### Fase 4: Recursos Avançados
- [ ] Estatísticas e relatórios pessoais
- [ ] Desafios de leitura
- [ ] Exportação de dados
- [ ] Notificações em tempo real
- [ ] Modo escuro
- [ ] Sistema de citações e marcadores
- [ ] Clubes de leitura virtuais

### Fase 5: Integrações e Marketplace
- [ ] Marketplace de livros usados
- [ ] Sistema de trocas literárias
- [ ] Integração com e-readers (Kindle, Kobo)
- [ ] Importação de dados do Goodreads
- [ ] Sincronização com apps mobile
- [ ] API pública para desenvolvedores

## 📁 Estrutura de Pastas

```
projeto-2026/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── (auth)/       # Rotas de autenticação
│   │   ├── (dashboard)/  # Área autenticada
│   │   └── layout.tsx
│   ├── components/       # Componentes React
│   │   ├── ui/           # Componentes base (shadcn)
│   │   ├── books/
│   │   ├── reviews/
│   │   └── layout/
│   ├── lib/              # Utilitários
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── api/
│   ├── types/            # TypeScript types
│   └── hooks/            # Custom hooks
├── public/               # Assets estáticos
├── .env.local           # Variáveis de ambiente
└── package.json
```

## 🔐 Segurança e Privacidade

- Autenticação segura com JWT
- Validação de inputs (Zod)
- Rate limiting nas APIs
- Sanitização de conteúdo (XSS prevention)
- CORS configurado adequadamente
- Dados sensíveis em variáveis de ambiente

## 🎨 Design e UX

- Interface limpa e moderna
- Tipografia legível (Inter ou Geist)
- Paleta de cores literária e elegante
- Animações sutis e transições suaves
- Responsivo (mobile-first)
- Acessibilidade (WCAG 2.1)

## 📝 Próximos Passos

1. Configurar repositório Git
2. Inicializar projeto Next.js
3. Configurar Prisma com PostgreSQL
4. Criar schema inicial do banco de dados
5. Implementar autenticação básica
6. Desenvolver interface de busca de livros
7. Criar página de biblioteca pessoal

## 🤝 Contribuindo

Este é um projeto pessoal, mas feedback e sugestões são sempre bem-vindos!

---

**Status**: 🟢 Em Desenvolvimento  
**Versão**: 1.1.0  
**Última Atualização**: Janeiro 2025
