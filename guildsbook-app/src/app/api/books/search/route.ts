import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

type SortOption = "title_asc" | "title_desc" | "author_asc" | "author_desc" | "year_asc" | "year_desc" | "created_desc" | "created_asc";

// GET /api/books/search - Buscar livros com filtros avançados
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

    return successResponse({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    return errorResponse("Erro ao buscar livros", 500);
  }
}