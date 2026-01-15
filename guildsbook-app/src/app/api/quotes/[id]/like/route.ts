import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// POST /api/quotes/[id]/like - Curtir/descurtir citação
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;

    // Verificar se a citação existe
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return errorResponse("Citação não encontrada", 404);
    }

    // Toggle like (incrementa/decrementa likes)
    // Nota: Esta é uma implementação simples. Para produção, considere um modelo de likes com usuários
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
      select: {
        id: true,
        likes: true,
      },
    });

    return successResponse(updatedQuote);
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Citação não encontrada", 404);
    }
    console.error("Erro ao curtir citação:", error);
    return errorResponse("Erro ao curtir citação", 500);
  }
}