import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookClubSchema, paginationSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// GET /api/clubs - Listar clubes (públicos ou do usuário)
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "public"; // "public" | "my" | "all"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    const where: any = {};

    if (filter === "public") {
      where.isPublic = true;
    } else if (filter === "my" && userId) {
      // Clubes que o usuário é membro ou dono
      where.OR = [
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ];
    } else if (filter === "all" && userId) {
      // Todos os clubes públicos OU que o usuário é membro/dono
      where.OR = [
        { isPublic: true },
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ];
    }

    const [clubs, total] = await Promise.all([
      prisma.bookClub.findMany({
        where,
        skip,
        take: pagination.limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              discussions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.bookClub.count({ where }),
    ]);

    // Verificar se o usuário atual é membro de cada clube
    const clubsWithMembership = await Promise.all(
      clubs.map(async (club) => {
        let isMember = false;
        let userRole = null;

        if (userId) {
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
          } else if (club.ownerId === userId) {
            isMember = true;
            userRole = "OWNER";
          }
        }

        return {
          ...club,
          isMember,
          userRole,
          memberCount: club._count.members,
          discussionCount: club._count.discussions,
        };
      })
    );

    return successResponse({
      data: clubsWithMembership.map(({ _count, ...club }) => club),
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
    console.error("Erro ao listar clubes:", error);
    return errorResponse("Erro ao listar clubes", 500);
  }
}

// POST /api/clubs - Criar clube
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const body = await request.json();
    const validatedData = bookClubSchema.parse(body);

    // Criar clube
    const club = await prisma.bookClub.create({
      data: {
        ...validatedData,
        ownerId: userId,
        currentMembers: 1, // O dono conta como membro
      },
    });

    // Adicionar o criador como membro OWNER
    await prisma.bookClubMember.create({
      data: {
        clubId: club.id,
        userId,
        role: "OWNER",
      },
    });

    return successResponse(
      {
        ...club,
        isMember: true,
        userRole: "OWNER",
      },
      201
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    console.error("Erro ao criar clube:", error);
    return errorResponse("Erro ao criar clube", 500);
  }
}
