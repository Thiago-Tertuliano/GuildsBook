import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// GET /api/stats - Estatísticas do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    // Buscar todos os livros lidos do usuário (status = "LIDO")
    const readBooks = await prisma.userBook.findMany({
      where: {
        userId,
        status: "LIDO",
      },
      include: {
        book: true,
      },
    });

    // 1. Livros lidos por mês/ano
    const booksByMonth: Record<string, number> = {};
    const booksByYear: Record<string, number> = {};

    readBooks.forEach((userBook) => {
      if (userBook.readDate) {
        const date = new Date(userBook.readDate);
        const year = date.getFullYear().toString();
        const monthYear = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        // Por mês/ano
        booksByMonth[monthYear] = (booksByMonth[monthYear] || 0) + 1;

        // Por ano
        booksByYear[year] = (booksByYear[year] || 0) + 1;
      }
    });

    // Converter para arrays ordenados
    const booksByMonthArray = Object.entries(booksByMonth)
      .map(([period, count]) => ({
        period,
        count,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const booksByYearArray = Object.entries(booksByYear)
      .map(([year, count]) => ({
        year,
        count,
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    // 2. Gêneros favoritos (contagem de livros por gênero)
    const genreCount: Record<string, number> = {};
    readBooks.forEach((userBook) => {
      const genre = userBook.book.genre;
      if (genre) {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    });

    const favoriteGenres = Object.entries(genreCount)
      .map(([genre, count]) => ({
        genre,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 gêneros

    // 3. Total de páginas lidas
    const totalPages = readBooks.reduce((total, userBook) => {
      return total + (userBook.book.pages || 0);
    }, 0);

    // Estatísticas gerais
    const totalReadBooks = readBooks.length;
    const totalWantToRead = await prisma.userBook.count({
      where: {
        userId,
        status: "QUERO_LER",
      },
    });
    const totalReading = await prisma.userBook.count({
      where: {
        userId,
        status: "LENDO",
      },
    });

    // Média de páginas por livro
    const avgPagesPerBook =
      totalReadBooks > 0 ? Math.round(totalPages / totalReadBooks) : 0;

    return successResponse({
      booksByMonth: booksByMonthArray,
      booksByYear: booksByYearArray,
      favoriteGenres,
      totalPages,
      totalReadBooks,
      totalWantToRead,
      totalReading,
      avgPagesPerBook,
    });
  } catch (error: any) {
    console.error("Erro ao buscar estatísticas:", error);
    return errorResponse("Erro ao buscar estatísticas", 500);
  }
}
