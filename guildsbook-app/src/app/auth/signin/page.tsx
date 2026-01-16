"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        Configuration: "Há um problema com a configuração do servidor.",
        AccessDenied: "Você não tem permissão para fazer login.",
        Verification: "O link de verificação expirou ou já foi usado.",
        Default: "Ocorreu um erro ao fazer login. Tente novamente.",
      };
      setError(errorMessages[errorParam] || errorMessages.Default);
    }
  }, [errorParam]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Erro ao enviar email. Verifique o endereço e tente novamente.");
      } else if (result?.ok) {
        // Email enviado com sucesso
        router.push(`/auth/verify-request?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ffff96]/20 via-[#c39738]/10 to-[#7f4311]/10 dark:from-zinc-950 dark:via-[#361f00]/30 dark:to-[#5e4318]/30 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(195,151,56,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c39738]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7f4311]/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl border border-white/20 dark:border-zinc-800 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#c39738] to-[#5e4318] mb-4 shadow-lg shadow-[#c39738]/50">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#c39738] to-[#7f4311] bg-clip-text text-transparent">
            GuildsBook
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Entre com sua conta para continuar
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Login com Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-50 transition-all hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 hover:border-[#c39738] dark:hover:border-[#c39738] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-2 text-slate-500 dark:text-slate-400">
                ou
              </span>
            </div>
          </div>

          {/* Login com Email */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#c39738] dark:focus:border-[#c39738] focus:outline-none focus:ring-2 focus:ring-[#c39738]/20 transition-colors"
                placeholder="email@exemplo.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#c39738] to-[#7f4311] px-4 py-3 text-sm font-medium text-white transition-all hover:from-[#b08732] hover:to-[#6f3a0f] focus:outline-none focus:ring-2 focus:ring-[#c39738] focus:ring-offset-2 shadow-lg shadow-[#c39738]/50 hover:shadow-xl hover:shadow-[#7f4311]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {isLoading ? "Enviando..." : "Entrar com Email"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}