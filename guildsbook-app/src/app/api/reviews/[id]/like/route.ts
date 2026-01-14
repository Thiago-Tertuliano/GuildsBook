import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// POST /api/reviews/[id]/like - Dar like em review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar a review
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return errorResponse("Review não encontrada", 404);
    }

    // Incrementar likes
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
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

    return successResponse(updatedReview);
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Review não encontrada", 404);
    }
    return errorResponse("Erro ao dar like na review", 500);
  }
}