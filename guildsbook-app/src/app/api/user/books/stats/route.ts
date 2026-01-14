import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/user/books/stats - Estatísticas pessoais
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId"); // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    const [
      totalBooks,
      booksByStatus,
      averageRating,
      booksReadData,
    ] = await Promise.all([
      // Total de livros na biblioteca
      prisma.userBook.count({
        where: { userId },
      }),

      // Livros por status
      prisma.userBook.groupBy({
        by: ["status"],
        where: { userId, status: { not: null } },
        _count: true,
      }),

      // Média de ratings
      prisma.userBook.aggregate({
        where: {
          userId,
          rating: { not: null },
        },
        _avg: {
          rating: true,
        },
      }),

      // Buscar livros lidos para calcular páginas
      prisma.userBook.findMany({
        where: {
          userId,
          status: "LIDO",
        },
        include: {
          book: {
            select: { pages: true },
          },
        },
      }),
    ]);

    // Calcular total de páginas lidas
    const totalPages = booksReadData.reduce(
      (sum, userBook) => sum + (userBook.book.pages || 0),
      0
    );

    // Contar livros lidos
    const booksRead = booksReadData.length;

    // Formatar estatísticas por status
    const statusStats = {
      QUERO_LER: 0,
      LENDO: 0,
      LIDO: 0,
    };

    booksByStatus.forEach((item) => {
      if (item.status) {
        statusStats[item.status as keyof typeof statusStats] = item._count;
      }
    });

    return successResponse({
      totalBooks,
      booksRead,
      booksByStatus: statusStats,
      totalPages,
      averageRating: averageRating._avg.rating
        ? Math.round(averageRating._avg.rating * 10) / 10
        : null,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return errorResponse("Erro ao buscar estatísticas", 500);
  }
}