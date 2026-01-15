import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/user/[id]/books/stats - Estatísticas públicas de um usuário
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return errorResponse("ID de usuário inválido", 400);
    }

    const [
      totalBooks,
      booksByStatus,
      averageRating,
      booksReadData,
    ] = await Promise.all([
      prisma.userBook.count({
        where: { userId: id },
      }),
      prisma.userBook.groupBy({
        by: ["status"],
        where: { userId: id, status: { not: null } },
        _count: true,
      }),
      prisma.userBook.aggregate({
        where: {
          userId: id,
          rating: { not: null },
        },
        _avg: {
          rating: true,
        },
      }),
      prisma.userBook.findMany({
        where: {
          userId: id,
          status: "LIDO",
        },
        include: {
          book: {
            select: { pages: true },
          },
        },
      }),
    ]);

    const totalPages = booksReadData.reduce(
      (sum, userBook) => sum + (userBook.book.pages || 0),
      0
    );

    const booksRead = booksReadData.length;

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