"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: "Erro de Configuração",
    message: "Há um problema com a configuração do servidor. Entre em contato com o suporte.",
  },
  AccessDenied: {
    title: "Acesso Negado",
    message: "Você não tem permissão para fazer login. Verifique suas credenciais.",
  },
  Verification: {
    title: "Link Expirado",
    message: "O link de verificação expirou ou já foi usado. Solicite um novo link.",
  },
  OAuthAccountNotLinked: {
    title: "Conta Não Vinculada",
    message: "Este email já está associado a outra conta. Use o método de login original ou entre em contato com o suporte para vincular as contas.",
  },
  OAuthCallback: {
    title: "Erro no Callback",
    message: "Ocorreu um erro ao processar o login. Tente novamente ou use outro método de autenticação.",
  },
  Default: {
    title: "Erro ao Fazer Login",
    message: "Ocorreu um erro ao fazer login. Tente novamente.",
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white dark:bg-zinc-800 p-8 shadow-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {errorInfo.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {errorInfo.message}
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tentar Novamente
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-50 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-600"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Carregando...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}