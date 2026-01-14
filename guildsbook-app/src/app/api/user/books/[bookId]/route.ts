import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userBookSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// PUT /api/user/books/[bookId] - Atualizar status/rating/review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const body = await request.json();
    const userId = body.userId; // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Validar dados (remover bookId do body se existir)
    const { bookId: _, ...updateData } = userBookSchema.parse(body);

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
    const { bookId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId"); // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

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