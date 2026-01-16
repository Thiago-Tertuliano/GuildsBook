import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// DELETE /api/clubs/[id]/leave - Sair do clube
export async function DELETE(
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

    // Não permitir que o dono saia do clube (deveria deletar o clube)
    if (club.ownerId === userId) {
      return errorResponse("O dono do clube não pode sair. Delete o clube se necessário.", 400);
    }

    // Verificar se é membro
    const membership = await prisma.bookClubMember.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId,
        },
      },
    });

    if (!membership) {
      return errorResponse("Você não é membro deste clube", 400);
    }

    // Remover membro
    await prisma.$transaction([
      prisma.bookClubMember.delete({
        where: {
          clubId_userId: {
            clubId: id,
            userId,
          },
        },
      }),
      prisma.bookClub.update({
        where: { id },
        data: {
          currentMembers: {
            decrement: 1,
          },
        },
      }),
    ]);

    return successResponse({ message: "Você saiu do clube com sucesso" });
  } catch (error: any) {
    console.error("Erro ao sair do clube:", error);
    return errorResponse("Erro ao sair do clube", 500);
  }
}
