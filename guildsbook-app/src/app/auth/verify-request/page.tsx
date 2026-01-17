"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyRequestContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white dark:bg-zinc-800 p-8 shadow-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
          <svg
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Verifique seu email
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enviamos um link de login para{" "}
            {email && <span className="font-medium">{email}</span>}
            {!email && "seu email"}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-700/50 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Clique no link no email para fazer login. Se você não recebeu o email, verifique sua
            pasta de spam.
          </p>
        </div>

        <Link
          href="/auth/signin"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Voltar para login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Carregando...</p>
        </div>
      </div>
    }>
      <VerifyRequestContent />
    </Suspense>
  );
}