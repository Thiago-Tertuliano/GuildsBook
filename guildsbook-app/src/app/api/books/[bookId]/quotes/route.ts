import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { paginationSchema } from "@/lib/api/schemas";

// GET /api/books/[bookId]/quotes - Listar citações de um livro
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const userId = await getUserId();
    const { bookId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    // Verificar se o livro existe
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return errorResponse("Livro não encontrado", 404);
    }

    // Filtro de visibilidade: usuário autenticado vê próprias e públicas
    let where: any = { bookId };
    if (userId) {
      where.OR = [{ isPublic: true }, { userId }];
    } else {
      where.isPublic = true;
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: pagination.limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.quote.count({ where }),
    ]);

    return successResponse({
      data: quotes,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Parâmetros inválidos", 400);
    }
    console.error("Erro ao listar citações do livro:", error);
    return errorResponse("Erro ao listar citações do livro", 500);
  }
}