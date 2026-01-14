import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/books/search - Buscar livros (título, autor, ISBN)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
      return errorResponse("Parâmetro 'q' (query) é obrigatório", 400);
    }

    const skip = (page - 1) * limit;

    // Buscar livros (título, autor ou ISBN)
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
            { isbn: { contains: query, mode: "insensitive" } },
          ],
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
            { isbn: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
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
    return errorResponse("Erro ao buscar livros", 500);
    }
}