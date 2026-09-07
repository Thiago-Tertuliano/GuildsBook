import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  getErrorProps,
  handleValidationError,
} from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { quoteSchema, paginationSchema } from "@/lib/api/schemas";

// GET /api/quotes - Listar citações (com filtros)
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get("bookId");
    const userIdFilter = searchParams.get("userId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    const where: Prisma.QuoteWhereInput = {};

    // Filtrar por livro
    if (bookId) {
      where.bookId = bookId;
    }

    // Filtrar por usuário
    if (userIdFilter) {
      where.userId = userIdFilter;
    }

    // Busca por conteúdo
    if (search) {
      where.content = {
        contains: search,
        mode: "insensitive" as const,
      };
    }

    // Filtro de visibilidade: usuário autenticado vê próprias e públicas
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
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              cover: true,
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
  } catch (error: unknown) {
    const err = getErrorProps(error);
    if (err.name === "ZodError") {
      return errorResponse("Parâmetros inválidos", 400);
    }
    console.error("Erro ao listar citações:", error);
    return errorResponse("Erro ao listar citações", 500);
  }
}

// POST /api/quotes - Criar citação
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    // Verificar se o livro existe
    const book = await prisma.book.findUnique({
      where: { id: validatedData.bookId },
    });

    if (!book) {
      return errorResponse("Livro não encontrado", 404);
    }

    const quote = await prisma.quote.create({
      data: {
        userId,
        ...validatedData,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            cover: true,
          },
        },
      },
    });

    return successResponse(quote, 201);
  } catch (error: unknown) {
    const err = getErrorProps(error);
    if (err.name === "ZodError") {
      return handleValidationError(error);
    }
    console.error("Erro ao criar citação:", error);
    return errorResponse("Erro ao criar citação", 500);
  }
}
