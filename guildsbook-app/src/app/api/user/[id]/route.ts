import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/user/[id] - Obter perfil público de um usuário
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            userBooks: true,
            reviews: true,
            readingLists: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("Usuário não encontrado", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return errorResponse("Erro ao buscar perfil", 500);
  }
}