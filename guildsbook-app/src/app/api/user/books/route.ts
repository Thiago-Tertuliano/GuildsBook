import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { userBookSchema, paginationSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// GET /api/user/books - Listar livros do usuário
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId"); // TODO: Obter da sessão quando autenticação for implementada
    const status = searchParams.get("status"); // Filtro opcional: QUERO_LER, LENDO, LIDO
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return errorResponse("userId é obrigatório", 400);
    }

    const pagination = paginationSchema.parse({ page, limit });
    const skip = (pagination.page - 1) * pagination.limit;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [userBooks, total] = await Promise.all([
      prisma.userBook.findMany({
        where,
        skip,
        take: pagination.limit,
        include: {
          book: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.userBook.count({ where }),
    ]);

    return successResponse({
      data: userBooks,
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
    return errorResponse("Erro ao listar livros do usuário", 500);
  }
}

// POST /api/user/books - Adicionar livro à biblioteca
export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const userId = body.userId;
  
      if (!userId) {
        return errorResponse("userId é obrigatório", 400);
      }
  
      const validatedData = userBookSchema.parse(body);
  
      // Verificar se o livro existe
      const book = await prisma.book.findUnique({
        where: { id: validatedData.bookId },
      });
  
      if (!book) {
        return errorResponse("Livro não encontrado", 404);
      }
  
      // Verificar se já existe na biblioteca
      const existingUserBook = await prisma.userBook.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId: validatedData.bookId,
          },
        },
      });
  
      let userBook;
      if (existingUserBook) {
        // Atualizar se já existe
        userBook = await prisma.userBook.update({
          where: { id: existingUserBook.id },
          data: validatedData,
          include: { book: true },
        });
      } else {
        // Criar se não existe
        userBook = await prisma.userBook.create({
          data: {
            userId,
            ...validatedData,
          },
          include: { book: true },
        });
      }
  
      return successResponse(userBook, existingUserBook ? 200 : 201);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return handleValidationError(error);
      }
      if (error.code === "P2002") {
        return errorResponse("Livro já está na biblioteca", 409);
      }
      if (error.code === "P2025") {
        return errorResponse("Livro não encontrado na biblioteca", 404);
      }
      return errorResponse("Erro ao adicionar livro à biblioteca", 500);
    }
  }