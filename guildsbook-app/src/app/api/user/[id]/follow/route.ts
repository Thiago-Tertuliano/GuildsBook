import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// POST /api/user/[id]/follow - Seguir um usuário
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id: followingId } = await params;

    // Validar UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(followingId)) {
      return errorResponse("ID de usuário inválido", 400);
    }

    // Não pode seguir a si mesmo
    if (userId === followingId) {
      return errorResponse("Você não pode seguir a si mesmo", 400);
    }

    // Verificar se o usuário existe
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!userToFollow) {
      return errorResponse("Usuário não encontrado", 404);
    }

    // Verificar se já segue
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return errorResponse("Você já segue este usuário", 409);
    }

    // Criar follow
    const follow = await prisma.follow.create({
      data: {
        followerId: userId,
        followingId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return successResponse(follow, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return errorResponse("Você já segue este usuário", 409);
    }
    console.error("Erro ao seguir usuário:", error);
    return errorResponse("Erro ao seguir usuário", 500);
  }
}

// DELETE /api/user/[id]/follow - Deixar de seguir um usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id: followingId } = await params;

    // Validar UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(followingId)) {
      return errorResponse("ID de usuário inválido", 400);
    }

    // Buscar e deletar follow
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId,
        },
      },
    });

    if (!follow) {
      return errorResponse("Você não segue este usuário", 404);
    }

    await prisma.follow.delete({
      where: {
        id: follow.id,
      },
    });

    return successResponse({ message: "Deixou de seguir com sucesso" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Você não segue este usuário", 404);
    }
    console.error("Erro ao deixar de seguir:", error);
    return errorResponse("Erro ao deixar de seguir", 500);
  }
}

// GET /api/user/[id]/follow - Verificar se está seguindo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id: followingId } = await params;

    // Validar UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(followingId)) {
      return errorResponse("ID de usuário inválido", 400);
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId,
        },
      },
    });

    return successResponse({ isFollowing: !!follow });
  } catch (error) {
    console.error("Erro ao verificar follow:", error);
    return errorResponse("Erro ao verificar follow", 500);
  }
}