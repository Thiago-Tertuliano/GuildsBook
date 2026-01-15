import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { quoteUpdateSchema } from "@/lib/api/schemas";

// GET /api/quotes/[id] - Obter citação específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            cover: true,
          },
        },
      },
    });

    if (!quote) {
      return errorResponse("Citação não encontrada", 404);
    }

    // Verificar permissão: só pode ver se for pública ou se for o dono
    if (!quote.isPublic && quote.userId !== userId) {
      return errorResponse("Citação privada", 403);
    }

    return successResponse(quote);
  } catch (error) {
    console.error("Erro ao buscar citação:", error);
    return errorResponse("Erro ao buscar citação", 500);
  }
}

// PUT /api/quotes/[id] - Atualizar citação
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = quoteUpdateSchema.parse(body);

    // Verificar se a citação existe e se o usuário é o dono
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return errorResponse("Citação não encontrada", 404);
    }

    if (quote.userId !== userId) {
      return errorResponse("Você não tem permissão para atualizar esta citação", 403);
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            cover: true,
          },
        },
      },
    });

    return successResponse(updatedQuote);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    if (error.code === "P2025") {
      return errorResponse("Citação não encontrada", 404);
    }
    console.error("Erro ao atualizar citação:", error);
    return errorResponse("Erro ao atualizar citação", 500);
  }
}

// DELETE /api/quotes/[id] - Deletar citação
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;

    // Verificar se a citação existe e se o usuário é o dono
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return errorResponse("Citação não encontrada", 404);
    }

    if (quote.userId !== userId) {
      return errorResponse("Você não tem permissão para deletar esta citação", 403);
    }

    await prisma.quote.delete({
      where: { id },
    });

    return successResponse({ message: "Citação deletada com sucesso" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Citação não encontrada", 404);
    }
    console.error("Erro ao deletar citação:", error);
    return errorResponse("Erro ao deletar citação", 500);
  }
}