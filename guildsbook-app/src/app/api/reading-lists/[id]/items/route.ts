import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { z } from "zod";

const addItemSchema = z.object({
  bookId: z.string().uuid("ID do livro inválido"),
  order: z.number().int().min(0).optional(),
});

// POST /api/reading-lists/[id]/items - Adicionar livro à lista
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const { id: listId } = await params;
    const body = await request.json();
    const validatedData = addItemSchema.parse(body);

    // Verificar se a lista existe e se o usuário é o dono
    const list = await prisma.readingList.findUnique({
      where: { id: listId },
    });

    if (!list) {
      return errorResponse("Lista não encontrada", 404);
    }

    if (list.userId !== userId) {
      return errorResponse("Você não tem permissão para adicionar livros a esta lista", 403);
    }

    // Verificar se o livro existe
    const book = await prisma.book.findUnique({
      where: { id: validatedData.bookId },
    });

    if (!book) {
      return errorResponse("Livro não encontrado", 404);
    }

    // Verificar se já está na lista
    const existingItem = await prisma.readingListItem.findUnique({
      where: {
        listId_bookId: {
          listId,
          bookId: validatedData.bookId,
        },
      },
    });

    if (existingItem) {
      return errorResponse("Livro já está na lista", 409);
    }

    // Obter o próximo order se não fornecido
    let order = validatedData.order;
    if (order === undefined) {
      const maxOrder = await prisma.readingListItem.findFirst({
        where: { listId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (maxOrder?.order ?? -1) + 1;
    }

    const item = await prisma.readingListItem.create({
      data: {
        listId,
        bookId: validatedData.bookId,
        order,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            cover: true,
          },
        },
      },
    });

    return successResponse(item, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    if (error.code === "P2002") {
      return errorResponse("Livro já está na lista", 409);
    }
    if (error.code === "P2025") {
      return errorResponse("Lista ou livro não encontrado", 404);
    }
    console.error("Erro ao adicionar livro à lista:", error);
    return errorResponse("Erro ao adicionar livro à lista", 500);
  }
}

// DELETE /api/reading-lists/[id]/items?itemId=xxx - Remover livro da lista
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const userId = await getUserId();
  
      if (!userId) {
        return errorResponse("Não autenticado", 401);
      }
  
      const { id: listId } = await params;
      const searchParams = request.nextUrl.searchParams;
      const itemId = searchParams.get("itemId");
  
      if (!itemId) {
        return errorResponse("itemId é obrigatório", 400);
      }
  
      // Verificar se a lista existe e se o usuário é o dono
      const list = await prisma.readingList.findUnique({
        where: { id: listId },
      });
  
      if (!list) {
        return errorResponse("Lista não encontrada", 404);
      }
  
      if (list.userId !== userId) {
        return errorResponse("Você não tem permissão para remover livros desta lista", 403);
      }
  
      // Verificar se o item existe
      const item = await prisma.readingListItem.findUnique({
        where: { id: itemId },
      });
  
      if (!item || item.listId !== listId) {
        return errorResponse("Item não encontrado na lista", 404);
      }
  
      await prisma.readingListItem.delete({
        where: { id: itemId },
      });
  
      return successResponse({ message: "Livro removido da lista com sucesso" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return errorResponse("Item não encontrado", 404);
      }
      console.error("Erro ao remover livro da lista:", error);
      return errorResponse("Erro ao remover livro da lista", 500);
    }
  }