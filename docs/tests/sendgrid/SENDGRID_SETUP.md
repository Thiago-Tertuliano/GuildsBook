# Guia de Configuração do SendGrid - GuildsBook

Este guia explica como obter as API keys do SendGrid e configurar para usar com o GuildsBook.

## 📋 Índice

1. [Obter API Key do SendGrid](#1-obter-api-key-do-sendgrid)
2. [Opção 1: Usar SendGrid via SMTP (NextAuth)](#opção-1-usar-sendgrid-via-smtp-nextauth)
3. [Opção 2: Usar SendGrid API (Templates Dinâmicos)](#opção-2-usar-sendgrid-api-templates-dinâmicos)

---

## 1. Obter API Key do SendGrid

### Passo 1: Criar Conta no SendGrid

1. Acesse: https://signup.sendgrid.com/
2. Crie uma conta gratuita (100 emails/dia grátis)

### Passo 2: Verificar Domínio (Opcional mas Recomendado)

1. No dashboard do SendGrid, vá em **Settings** → **Sender Authentication**
2. Clique em **Authenticate Your Domain** ou **Single Sender Verification**
3. Siga as instruções para verificar seu domínio ou email

### Passo 3: Criar API Key

1. No dashboard do SendGrid, vá em **Settings** → **API Keys**
2. Clique em **Create API Key**
3. Dê um nome (ex: "GuildsBook Production")
4. Escolha **Full Access** ou **Restricted Access** (recomendado: Restricted Access com permissões de "Mail Send")
5. Clique em **Create & View**
6. **COPIE A API KEY IMEDIATAMENTE** - ela só aparece uma vez!
   - Formato: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Passo 4: Obter Template ID (se usar Templates Dinâmicos)

1. No dashboard, vá em **Email API** → **Dynamic Templates**
2. Encontre o template que você criou
3. Copie o **Template ID** (ex: `d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

---

## Opção 1: Usar SendGrid via SMTP (NextAuth)

Esta é a opção mais simples e funciona diretamente com o NextAuth Email provider.

### Configuração das Variáveis de Ambiente

Adicione ao seu `.env.local` ou variáveis de ambiente no Railway:

```env
# SendGrid SMTP Configuration
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="SG.sua-api-key-aqui"
EMAIL_FROM="noreply@guildsbook.com"  # Use um email verificado no SendGrid
```

**Importante:**
- `EMAIL_SERVER_USER` deve ser sempre `"apikey"` (literalmente)
- `EMAIL_SERVER_PASSWORD` é sua API Key do SendGrid
- `EMAIL_FROM` deve ser um email verificado no SendGrid

### Vantagens:
✅ Funciona diretamente com NextAuth  
✅ Configuração simples  
✅ Não precisa de código adicional  

### Desvantagens:
❌ Não pode usar templates dinâmicos do SendGrid  
❌ Usa o template padrão do NextAuth  

---

## Opção 2: Usar SendGrid API (Templates Dinâmicos)

Esta opção permite usar os templates dinâmicos que você criou no SendGrid, mas requer código customizado.

### Passo 1: Instalar SDK do SendGrid

```bash
npm install @sendgrid/mail
```

### Passo 2: Criar Serviço de Email Customizado

Crie o arquivo `src/lib/email.ts`:

```typescript
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendVerificationEmail({
  to,
  url,
  baseUrl,
}: {
  to: string;
  url: string;
  baseUrl: string;
}) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM || 'noreply@guildsbook.com',
    templateId: process.env.SENDGRID_TEMPLATE_ID || '', // ID do seu template dinâmico
    dynamicTemplateData: {
      url, // Link de verificação
      baseUrl, // URL base da aplicação
      year: new Date().getFullYear(),
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Email enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}
```

### Passo 3: Criar Provider Customizado para NextAuth

Crie o arquivo `src/lib/custom-email-provider.ts`:

```typescript
import type { EmailConfig } from "next-auth/providers/email";
import { sendVerificationEmail } from "./email";

export function CustomEmailProvider(options: EmailConfig) {
  return {
    id: "email",
    type: "email",
    name: "Email",
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
    async sendVerificationRequest({ identifier: email, url, provider }) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      
      // Se tiver template ID configurado, usa SendGrid API
      if (process.env.SENDGRID_TEMPLATE_ID) {
        await sendVerificationEmail({
          to: email,
          url,
          baseUrl,
        });
      } else {
        // Fallback para SMTP padrão
        const { host } = new URL(url);
        await provider.send({
          to: email,
          from: provider.from,
          subject: `Entre no GuildsBook`,
          text: `Entre no GuildsBook usando este link:\n${url}\n\n`,
          html: `<p>Entre no GuildsBook usando este link:</p><p><a href="${url}">${url}</a></p>`,
        });
      }
    },
  };
}
```

### Passo 4: Atualizar NextAuth para Usar o Provider Customizado

Atualize `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { CustomEmailProvider } from "@/lib/custom-email-provider";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
  providers: [
    CustomEmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // ... resto da configuração
});
```

### Passo 5: Configurar Variáveis de Ambiente

```env
# SendGrid API (para templates dinâmicos)
SENDGRID_API_KEY="SG.sua-api-key-aqui"
SENDGRID_TEMPLATE_ID="d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Email básico
EMAIL_FROM="noreply@guildsbook.com"

# SMTP (fallback ou se não usar API)
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="SG.sua-api-key-aqui"
```

### Vantagens:
✅ Usa templates dinâmicos do SendGrid  
✅ Mais controle sobre o design do email  
✅ Melhor tracking e analytics  

### Desvantagens:
❌ Requer código adicional  
❌ Mais complexo de configurar  

---

## 🔧 Configuração no Railway (Produção)

1. Acesse seu projeto no Railway
2. Vá em **Variables**
3. Adicione todas as variáveis de ambiente necessárias:
   - `SENDGRID_API_KEY`
   - `SENDGRID_TEMPLATE_ID` (se usar Opção 2)
   - `EMAIL_FROM`
   - `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, etc. (se usar Opção 1)

---

## 🧪 Testar a Configuração

### Teste Rápido (Opção 1 - SMTP)

1. Configure as variáveis de ambiente
2. Tente fazer login com email
3. Verifique se o email chegou

### Teste com Template (Opção 2 - API)

1. Configure todas as variáveis
2. Verifique se o `SENDGRID_TEMPLATE_ID` está correto
3. Tente fazer login com email
4. Verifique se o email chegou com o template personalizado

---

## 📝 Variáveis do Template Dinâmico

Se você usar a Opção 2, certifique-se de que seu template no SendGrid tenha estas variáveis:

- `{{url}}` - Link de verificação
- `{{baseUrl}}` - URL base da aplicação
- `{{year}}` - Ano atual (opcional)

No SendGrid, configure essas variáveis no editor de template dinâmico.

---

## 🆘 Troubleshooting

### Email não está sendo enviado

1. Verifique se a API Key está correta
2. Verifique se o email `EMAIL_FROM` está verificado no SendGrid
3. Verifique os logs do Railway para erros
4. Teste a API Key diretamente no SendGrid (Activity → API Keys)

### Template não aparece

1. Verifique se o `SENDGRID_TEMPLATE_ID` está correto
2. Verifique se as variáveis do template correspondem ao código
3. Verifique se o template está publicado no SendGrid

### Erro de autenticação SMTP

1. Certifique-se de que `EMAIL_SERVER_USER` é exatamente `"apikey"`
2. Verifique se a API Key está completa (começa com `SG.`)
3. Verifique se a porta está correta (587 para TLS)

---

## 📚 Recursos Adicionais

- [Documentação SendGrid](https://docs.sendgrid.com/)
- [SendGrid Node.js SDK](https://github.com/sendgrid/sendgrid-nodejs)
- [NextAuth Email Provider](https://authjs.dev/getting-started/providers/email)
