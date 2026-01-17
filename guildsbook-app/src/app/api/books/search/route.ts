import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { searchGoogleBooks, syncGoogleBookToDatabase } from "@/lib/api/google-books";

type SortOption = "title_asc" | "title_desc" | "author_asc" | "author_desc" | "year_asc" | "year_desc" | "created_desc" | "created_asc";

// GET /api/books/search - Buscar livros com filtros avançados (local + Google Books como fallback)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const genre = searchParams.get("genre") || "";
    const year = searchParams.get("year") || "";
    const publisher = searchParams.get("publisher") || "";
    const language = searchParams.get("language") || "";
    const sort = (searchParams.get("sort") || "created_desc") as SortOption;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Construir where clause
    let where: any = {};

    // Busca por texto (título, autor ou ISBN)
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
        { isbn: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filtro por gênero
    if (genre) {
      where.genre = genre;
    }

    // Filtro por ano
    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        where.publishedYear = yearNum;
      }
    }

    // Filtro por editora
    if (publisher) {
      where.publisher = {
        contains: publisher,
        mode: "insensitive" as const,
      };
    }

    // Filtro por idioma
    if (language) {
      where.language = {
        contains: language,
        mode: "insensitive" as const,
      };
    }

    // Ordenação
    let orderBy: any = {};
    switch (sort) {
      case "title_asc":
        orderBy = { title: "asc" };
        break;
      case "title_desc":
        orderBy = { title: "desc" };
        break;
      case "author_asc":
        orderBy = { author: "asc" };
        break;
      case "author_desc":
        orderBy = { author: "desc" };
        break;
      case "year_asc":
        orderBy = { publishedYear: "asc" };
        break;
      case "year_desc":
        orderBy = { publishedYear: "desc" };
        break;
      case "created_asc":
        orderBy = { createdAt: "asc" };
        break;
      case "created_desc":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.book.count({ where }),
    ]);

    // Se não encontrou resultados e há uma query de texto, buscar na Google Books API
    // Apenas buscar na API externa se não houver filtros específicos (genre, year, publisher, language)
    // e se houver uma query de busca
    const hasSpecificFilters = genre || year || publisher || language;
    const shouldSearchExternal = query && books.length === 0 && !hasSpecificFilters;

    if (shouldSearchExternal) {
      try {
        // Buscar na Google Books API
        const externalResults = await searchGoogleBooks(query, limit);

        if (externalResults.books.length > 0) {
          // Sincronizar os livros encontrados com o banco de dados
          const syncedBooks = await Promise.all(
            externalResults.books.map((bookData) => syncGoogleBookToDatabase(bookData))
          );

          // Retornar os livros sincronizados (formato do Prisma)
          return successResponse({
            data: syncedBooks,
            pagination: {
              page: 1,
              limit: syncedBooks.length,
              total: externalResults.totalItems,
              totalPages: Math.ceil(externalResults.totalItems / limit),
            },
            fromExternal: true, // Flag para indicar que veio da API externa
          });
        }
      } catch (externalError) {
        // Se houver erro na API externa, apenas logar e continuar com resultado vazio
        console.error("Erro ao buscar na API externa:", externalError);
        // Não retornar erro, apenas continuar com resultado vazio do banco local
      }
    }

    return successResponse({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      fromExternal: false,
    });
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    return errorResponse("Erro ao buscar livros", 500);
  }
}