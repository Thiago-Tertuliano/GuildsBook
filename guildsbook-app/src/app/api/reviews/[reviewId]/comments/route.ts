import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentSchema, paginationSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// GET /api/reviews/[reviewId]/comments - Listar comentários
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    // Verificar se a review existe
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return errorResponse("Review não encontrada", 404);
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { reviewId },
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
        orderBy: { createdAt: "asc" },
      }),
      prisma.comment.count({ where: { reviewId } }),
    ]);

    return successResponse({
      data: comments,
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
    return errorResponse("Erro ao listar comentários", 500);
  }
}

// POST /api/reviews/[reviewId]/comments - Criar comentário
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const body = await request.json();
    const userId = body.userId; // TODO: Obter da sessão quando autenticação for implementada

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    // Verificar se a review existe
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return errorResponse("Review não encontrada", 404);
    }

    // Validar dados (substituir reviewId do body pelo da URL)
    const validatedData = commentSchema.parse({ ...body, reviewId });

    // Criar comentário
    const comment = await prisma.comment.create({
      data: {
        userId,
        reviewId,
        content: validatedData.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return successResponse(comment, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    return errorResponse("Erro ao criar comentário", 500);
  }
}