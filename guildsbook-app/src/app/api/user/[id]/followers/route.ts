import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { paginationSchema } from "@/lib/api/schemas";

// GET /api/user/[id]/followers - Listar seguidores de um usuário
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return errorResponse("ID de usuário inválido", 400);
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return errorResponse("Usuário não encontrado", 404);
    }

    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: id },
        skip,
        take: pagination.limit,
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.follow.count({ where: { followingId: id } }),
    ]);

    const followers = follows.map((follow) => follow.follower);

    return successResponse({
      data: followers,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Parâmetros de paginação inválidos", 400);
    }
    console.error("Erro ao listar seguidores:", error);
    return errorResponse("Erro ao listar seguidores", 500);
  }
}