import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// GET /api/feed - Feed de atividades recentes
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "all"; // "all" | "following"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Se filtrar por "following" e usuário estiver autenticado
    let whereClause: any = {};
    
    if (filter === "following" && userId) {
      // Buscar IDs dos usuários que o usuário segue
      const followingUsers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = followingUsers.map((f) => f.followingId);
      
      if (followingIds.length === 0) {
        // Se não segue ninguém, retornar vazio
        return successResponse({
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }

      whereClause.userId = { in: followingIds };
    }

    // Buscar reviews recentes
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        skip,
        take: limit,
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: whereClause }),
    ]);

    // Formatar atividades
    const activities = reviews.map((review) => ({
      id: review.id,
      type: "review" as const,
      user: review.user,
      book: review.book,
      content: review.content,
      rating: review.rating,
      likes: review.likes,
      commentsCount: review._count.comments,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return successResponse({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar feed:", error);
    return errorResponse("Erro ao buscar feed", 500);
  }
}