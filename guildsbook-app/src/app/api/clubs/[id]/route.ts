import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// GET /api/clubs/[id] - Detalhes do clube
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();

    const club = await prisma.bookClub.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: { joinedAt: "desc" },
          take: 20, // Limitar membros exibidos
        },
        _count: {
          select: {
            members: true,
            discussions: true,
          },
        },
      },
    });

    if (!club) {
      return errorResponse("Clube não encontrado", 404);
    }

    // Verificar se é público ou se o usuário é membro/dono
    if (!club.isPublic && userId !== club.ownerId) {
      const isMember = await prisma.bookClubMember.findUnique({
        where: {
          clubId_userId: {
            clubId: club.id,
            userId: userId || "",
          },
        },
      });

      if (!isMember) {
        return errorResponse("Acesso negado", 403);
      }
    }

    // Verificar se o usuário atual é membro
    let isMember = false;
    let userRole = null;

    if (userId) {
      if (club.ownerId === userId) {
        isMember = true;
        userRole = "OWNER";
      } else {
        const membership = await prisma.bookClubMember.findUnique({
          where: {
            clubId_userId: {
              clubId: club.id,
              userId,
            },
          },
        });

        if (membership) {
          isMember = true;
          userRole = membership.role;
        }
      }
    }

    return successResponse({
      ...club,
      isMember,
      userRole,
      memberCount: club._count.members,
      discussionCount: club._count.discussions,
    });
  } catch (error: any) {
    console.error("Erro ao buscar clube:", error);
    return errorResponse("Erro ao buscar clube", 500);
  }
}
