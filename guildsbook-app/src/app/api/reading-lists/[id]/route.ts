import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { z } from "zod";

const readingListUpdateSchema = z.object({
  name: z.string().min(1, "Nome da lista é obrigatório").optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// GET /api/reading-lists/[id] - Obter detalhes de uma lista
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id } = await params;

    const list = await prisma.readingList.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        readingListItems: {
          orderBy: { order: "asc" },
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                cover: true,
                isbn: true,
                genre: true,
                publishedYear: true,
              },
            },
          },
        },
        _count: {
          select: {
            readingListItems: true,
          },
        },
      },
    });

    if (!list) {
      return errorResponse("Lista não encontrada", 404);
    }

    // Verificar permissão: só pode ver se for pública ou se for o dono
    if (!list.isPublic && list.userId !== userId) {
      return errorResponse("Lista privada", 403);
    }

    return successResponse(list);
  } catch (error) {
    console.error("Erro ao buscar lista:", error);
    return errorResponse("Erro ao buscar lista de leitura", 500);
  }
}

// PUT /api/reading-lists/[id] - Atualizar lista
export async function PUT(
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
    const validatedData = readingListUpdateSchema.parse(body);

    // Verificar se a lista existe e se o usuário é o dono
    const list = await prisma.readingList.findUnique({
      where: { id },
    });

    if (!list) {
      return errorResponse("Lista não encontrada", 404);
    }

    if (list.userId !== userId) {
      return errorResponse("Você não tem permissão para atualizar esta lista", 403);
    }

    const updatedList = await prisma.readingList.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            readingListItems: true,
          },
        },
      },
    });

    return successResponse(updatedList);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    if (error.code === "P2025") {
      return errorResponse("Lista não encontrada", 404);
    }
    console.error("Erro ao atualizar lista:", error);
    return errorResponse("Erro ao atualizar lista de leitura", 500);
  }
}

// DELETE /api/reading-lists/[id] - Deletar lista
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

    // Verificar se a lista existe e se o usuário é o dono
    const list = await prisma.readingList.findUnique({
      where: { id },
    });

    if (!list) {
      return errorResponse("Lista não encontrada", 404);
    }

    if (list.userId !== userId) {
      return errorResponse("Você não tem permissão para deletar esta lista", 403);
    }

    await prisma.readingList.delete({
      where: { id },
    });

    return successResponse({ message: "Lista deletada com sucesso" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return errorResponse("Lista não encontrada", 404);
    }
    console.error("Erro ao deletar lista:", error);
    return errorResponse("Erro ao deletar lista de leitura", 500);
  }
}