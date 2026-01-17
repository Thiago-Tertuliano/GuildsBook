import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // Permite confiar no host em produção (Railway, Vercel, etc.)
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
  providers: [
    Email({
      server: process.env.EMAIL_SERVER_HOST
        ? {
            host: process.env.EMAIL_SERVER_HOST,
            port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          }
        : undefined,
      from: process.env.EMAIL_FROM,
      // Customizar o envio de email para usar template dinâmico do SendGrid
      ...(process.env.SENDGRID_TEMPLATE_ID || process.env.SENDGRID_API_KEY
        ? {
            async sendVerificationRequest({ identifier: email, url }) {
              const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
              
              // Usa SendGrid API com template dinâmico
              await sendVerificationEmail({
                to: email,
                url,
                baseUrl,
              });
            },
          }
        : {}),
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Com PrismaAdapter (database sessions), o user vem do banco
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export const { GET, POST } = handlers;