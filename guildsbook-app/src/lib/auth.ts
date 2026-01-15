import { auth } from "@/app/api/auth/[...nextauth]/route";

/**
 * Helper para obter a sessão do usuário nas rotas da API
 * @returns A sessão do usuário ou null se não autenticado
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Helper para verificar se o usuário está autenticado
 * @returns true se autenticado, false caso contrário
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session;
}

/**
 * Helper para obter o ID do usuário da sessão
 * @returns O ID do usuário ou null se não autenticado
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}