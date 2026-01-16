import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// POST /api/clubs/[id]/join - Participar do clube
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;

    // Verificar se o clube existe
    const club = await prisma.bookClub.findUnique({
      where: { id },
    });

    if (!club) {
      return errorResponse("Clube não encontrado", 404);
    }

    // Verificar se já é membro
    const existingMember = await prisma.bookClubMember.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId,
        },
      },
    });

    if (existingMember) {
      return errorResponse("Você já é membro deste clube", 400);
    }

    // Verificar se o clube está cheio
    if (club.maxMembers && club.currentMembers >= club.maxMembers) {
      return errorResponse("O clube atingiu o número máximo de membros", 400);
    }

    // Verificar se o clube é privado e o usuário não é o dono
    if (!club.isPublic && club.ownerId !== userId) {
      return errorResponse("Não é possível participar de clubes privados sem convite", 403);
    }

    // Adicionar membro
    await prisma.$transaction([
      prisma.bookClubMember.create({
        data: {
          clubId: id,
          userId,
          role: "MEMBER",
        },
      }),
      prisma.bookClub.update({
        where: { id },
        data: {
          currentMembers: {
            increment: 1,
          },
        },
      }),
    ]);

    return successResponse({ message: "Você entrou no clube com sucesso" });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint violation
      return errorResponse("Você já é membro deste clube", 400);
    }
    console.error("Erro ao entrar no clube:", error);
    return errorResponse("Erro ao entrar no clube", 500);
  }
}
