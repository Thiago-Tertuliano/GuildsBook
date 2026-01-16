import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userBookUpdateSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// PUT /api/user/books/[bookId] - Atualizar status/rating/review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { bookId } = await params;
    const body = await request.json();

    // Validar dados (usar schema de atualização que não exige bookId)
    const updateData = userBookUpdateSchema.parse(body);

    const userBook = await prisma.userBook.update({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      data: updateData,
      include: {
        book: true,
      },
    });

    // Se houver review e rating, criar ou atualizar a entidade Review
    if (updateData.review && updateData.rating && updateData.review.trim()) {
      try {
        // Verificar se já existe uma Review para este livro e usuário
        const existingReview = await prisma.review.findUnique({
          where: {
            userId_bookId: {
              userId,
              bookId,
            },
          },
        });

        if (existingReview) {
          // Atualizar review existente
          await prisma.review.update({
            where: {
              userId_bookId: {
                userId,
                bookId,
              },
            },
            data: {
              content: updateData.review.trim(),
              rating: updateData.rating,
            },
          });
        } else {
          // Criar nova review
          await prisma.review.create({
            data: {
              userId,
              bookId,
              content: updateData.review.trim(),
              rating: updateData.rating,
            },
          });
        }
      } catch (error) {
        // Se falhar ao criar/atualizar review, apenas logar mas não falhar a atualização do UserBook
        console.error("Erro ao criar/atualizar Review:", error);
      }
    } else if (updateData.review === null || updateData.review === "") {
      // Se a review foi removida, remover a Review também
      try {
        await prisma.review.deleteMany({
          where: {
            userId,
            bookId,
          },
        });
      } catch (error) {
        // Se falhar, apenas logar
        console.error("Erro ao remover Review:", error);
      }
    }

    return successResponse(userBook);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    if (error.code === "P2025") {
      return errorResponse("Livro não encontrado na biblioteca", 404);
    }
    return errorResponse("Erro ao atualizar livro", 500);
  }
}

// DELETE /api/user/books/[bookId] - Remover da biblioteca
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { bookId } = await params;

    await prisma.userBook.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return successResponse({ message: "Livro removido da biblioteca com sucesso" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Livro não encontrado na biblioteca", 404);
    }
    return errorResponse("Erro ao remover livro da biblioteca", 500);
  }
}