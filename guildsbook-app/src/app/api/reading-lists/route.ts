import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api/utils";
import { getUserId } from "@/lib/auth";
import { z } from "zod";
import { paginationSchema } from "@/lib/api/schemas";

const readingListSchema = z.object({
  name: z.string().min(1, "Nome da lista é obrigatório"),
  description: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

// GET /api/reading-lists - Listar listas (próprias ou públicas)
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter") || "my"; // "my" | "public"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    let where: any = {};

    if (filter === "my" && userId) {
      where.userId = userId;
    } else if (filter === "public") {
      where.isPublic = true;
      if (userId) {
        // Incluir também as próprias listas do usuário
        where.OR = [{ isPublic: true }, { userId }];
      } else {
        where.isPublic = true;
      }
    }

    const [lists, total] = await Promise.all([
      prisma.readingList.findMany({
        where,
        skip,
        take: pagination.limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          readingListItems: {
            select: {
              id: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.readingList.count({ where }),
    ]);

    // Formatar resposta com contagem de livros
    const formattedLists = lists.map((list) => ({
      ...list,
      _count: {
        items: list.readingListItems.length,
      },
      readingListItems: undefined,
    }));

    return successResponse({
      data: formattedLists,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Parâmetros inválidos", 400);
    }
    console.error("Erro ao listar listas:", error);
    return errorResponse("Erro ao listar listas de leitura", 500);
  }
}

// POST /api/reading-lists - Criar lista de leitura
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return errorResponse("Não autenticado", 401);
    }

    const body = await request.json();
    const validatedData = readingListSchema.parse(body);

    const list = await prisma.readingList.create({
      data: {
        userId,
        ...validatedData,
      },
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

    return successResponse(list, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    console.error("Erro ao criar lista:", error);
    return errorResponse("Erro ao criar lista de leitura", 500);
  }
}