import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookClubDiscussionSchema, paginationSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";

// GET /api/clubs/[id]/discussions - Listar discussões do clube
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    // Verificar se o clube existe e se o usuário tem acesso
    const club = await prisma.bookClub.findUnique({
      where: { id },
    });

    if (!club) {
      return errorResponse("Clube não encontrado", 404);
    }

    // Verificar acesso (público ou membro)
    if (!club.isPublic && userId !== club.ownerId) {
      const isMember = await prisma.bookClubMember.findUnique({
        where: {
          clubId_userId: {
            clubId: id,
            userId: userId || "",
          },
        },
      });

      if (!isMember) {
        return errorResponse("Acesso negado", 403);
      }
    }

    const [discussions, total] = await Promise.all([
      prisma.bookClubDiscussion.findMany({
        where: { clubId: id },
        skip,
        take: pagination.limit,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
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
        },
        orderBy: [
          { scheduledDate: "asc" }, // Discussões agendadas primeiro
          { createdAt: "desc" }, // Depois por data de criação
        ],
      }),
      prisma.bookClubDiscussion.count({
        where: { clubId: id },
      }),
    ]);

    return successResponse({
      data: discussions,
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
    console.error("Erro ao listar discussões:", error);
    return errorResponse("Erro ao listar discussões", 500);
  }
}

// POST /api/clubs/[id]/discussions - Criar discussão
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
    const body = await request.json();

    // Validar dados
    const validatedData = bookClubDiscussionSchema.parse({
      ...body,
      clubId: id,
    });

    // Verificar se o clube existe
    const club = await prisma.bookClub.findUnique({
      where: { id },
    });

    if (!club) {
      return errorResponse("Clube não encontrado", 404);
    }

    // Verificar se o usuário é membro do clube
    const isOwner = club.ownerId === userId;
    const isMember = await prisma.bookClubMember.findUnique({
      where: {
        clubId_userId: {
          clubId: id,
          userId,
        },
      },
    });

    if (!isOwner && !isMember) {
      return errorResponse("Apenas membros do clube podem criar discussões", 403);
    }

    // Criar discussão
    const discussion = await prisma.bookClubDiscussion.create({
      data: {
        ...validatedData,
        clubId: id,
        creatorId: userId,
        scheduledDate: validatedData.scheduledDate
          ? new Date(validatedData.scheduledDate)
          : null,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        book: validatedData.bookId
          ? {
              select: {
                id: true,
                title: true,
                author: true,
                cover: true,
              },
            }
          : undefined,
      },
    });

    return successResponse(discussion, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    console.error("Erro ao criar discussão:", error);
    return errorResponse("Erro ao criar discussão", 500);
  }
}
