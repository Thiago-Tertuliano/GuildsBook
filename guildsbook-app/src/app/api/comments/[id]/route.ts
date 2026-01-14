import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentUpdateSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// PUT /api/comments/[id] - Atualizar comentário
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = body.userId; // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Buscar o comentário
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return errorResponse("Comentário não encontrado", 404);
    }

    // Verificar se o usuário é o dono do comentário
    if (comment.userId !== userId) {
      return errorResponse("Você não tem permissão para atualizar este comentário", 403);
    }

    // Validar dados
    const validatedData = commentUpdateSchema.parse(body);

    // Atualizar comentário
    const updatedComment = await prisma.comment.update({
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
      },
    });

    return successResponse(updatedComment);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    if (error.code === "P2025") {
      return errorResponse("Comentário não encontrado", 404);
    }
    return errorResponse("Erro ao atualizar comentário", 500);
  }
}

// DELETE /api/comments/[id] - Deletar comentário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId"); // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Buscar o comentário
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return errorResponse("Comentário não encontrado", 404);
    }

    // Verificar se o usuário é o dono do comentário
    if (comment.userId !== userId) {
      return errorResponse("Você não tem permissão para deletar este comentário", 403);
    }

    // Deletar comentário
    await prisma.comment.delete({
      where: { id },
    });

    return successResponse({ message: "Comentário deletado com sucesso" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Comentário não encontrado", 404);
    }
    return errorResponse("Erro ao deletar comentário", 500);
  }
}