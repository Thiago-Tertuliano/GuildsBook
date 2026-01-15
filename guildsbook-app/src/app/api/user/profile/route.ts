import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userProfileUpdateSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// GET /api/user/profile - Obter perfil do usuário autenticado
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          location: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
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

// PUT /api/user/profile - Atualizar perfil do usuário autenticado
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const body = await request.json();
    const validatedData = userProfileUpdateSchema.parse(body);

    // Preparar dados para atualização, convertendo string vazia em null para avatar
    const updateData: Prisma.UserUpdateInput = {
      ...(validatedData.name !== undefined && { name: validatedData.name }),
      ...(validatedData.bio !== undefined && { bio: validatedData.bio }),
      ...(validatedData.location !== undefined && { location: validatedData.location }),
      ...(validatedData.preferences !== undefined && { preferences: validatedData.preferences }),
      ...(validatedData.avatar !== undefined && {
        avatar: validatedData.avatar === "" ? null : validatedData.avatar,
      }),
    };

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          location: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return successResponse(updatedUser);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    if (error.code === "P2025") {
      return errorResponse("Usuário não encontrado", 404);
    }
    console.error("Erro ao atualizar perfil:", error);
    return errorResponse("Erro ao atualizar perfil", 500);
  }
}