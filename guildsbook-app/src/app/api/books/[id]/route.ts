import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/books/[id] - Detalhes de um livro
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params;  
    const book = await prisma.book.findUnique({
      where: { id },
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