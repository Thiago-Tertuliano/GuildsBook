import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema, paginationSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// GET /api/books/[bookId]/reviews - Listar reviews de um livro
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
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

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { bookId },
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { bookId } }),
    ]);

    return successResponse({
      data: reviews,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    return errorResponse("Erro ao listar reviews", 500);
  }
}

// POST /api/books/[bookId]/reviews - Criar review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const body = await request.json();
    const userId = body.userId; // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Verificar se o livro existe
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return errorResponse("Livro não encontrado", 404);
    }

    // Validar dados (substituir bookId do body pelo da URL)
    const validatedData = reviewSchema.parse({ ...body, bookId });

    // Verificar se já existe uma review do usuário para este livro
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existingReview) {
      return errorResponse("Você já tem uma review para este livro. Use PUT para atualizar.", 409);
    }

    // Criar review
    const review = await prisma.review.create({
      data: {
        userId,
        bookId,
        content: validatedData.content,
        rating: validatedData.rating,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return successResponse(review, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    if (error.code === "P2002") {
      return errorResponse("Você já tem uma review para este livro", 409);
    }
    return errorResponse("Erro ao criar review", 500);
  }
}