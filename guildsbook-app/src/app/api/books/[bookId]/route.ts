import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/books/[bookId] - Detalhes de um livro
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }  
) {
  try {
    const { bookId } = await params;  
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        _count: {
          select: {
            reviews: true,
            userBooks: true,
          },
        },
      },
    });

    if (!book) {
      return errorResponse("Livro não encontrado", 404);
    }

    return successResponse(book);
  } catch (error) {
    return errorResponse("Erro ao buscar livro", 500);
  }
}