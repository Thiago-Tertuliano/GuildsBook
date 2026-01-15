import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewUpdateSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// PUT /api/reviews/[reviewId] - Atualizar review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const body = await request.json();
    const userId = body.userId; // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Buscar a review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return errorResponse("Review não encontrada", 404);
    }

    // Verificar se o usuário é o dono da review
    if (review.userId !== userId) {
      return errorResponse("Você não tem permissão para atualizar esta review", 403);
    }

    // Validar dados
    const validatedData = reviewUpdateSchema.parse(body);

    if (!validatedData.content && validatedData.rating === undefined) {
      return errorResponse("Pelo menos um campo (content ou rating) deve ser fornecido", 400);
    }

    // Atualizar review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return successResponse(updatedReview);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    if (error.code === "P2025") {
      return errorResponse("Review não encontrada", 404);
    }
    return errorResponse("Erro ao atualizar review", 500);
  }
}

// DELETE /api/reviews/[reviewId] - Deletar review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId"); // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Buscar a review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return errorResponse("Review não encontrada", 404);
    }

    // Verificar se o usuário é o dono da review
    if (review.userId !== userId) {
      return errorResponse("Você não tem permissão para deletar esta review", 403);
    }

    // Deletar review (os comentários serão deletados automaticamente devido ao onDelete: Cascade)
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return successResponse({ message: "Review deletada com sucesso" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Review não encontrada", 404);
    }
    return errorResponse("Erro ao deletar review", 500);
  }
}