import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookSchema, paginationSchema } from "@/lib/api/schemas";
import { successResponse, errorResponse, handleValidationError } from "@/lib/api/utils";

// GET /api/books - Listar livros (com paginação)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Validar parâmetros de paginação
    const pagination = paginationSchema.parse({ page, limit });

    const skip = (pagination.page - 1) * pagination.limit;

    // Buscar livros
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        skip,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count(),
    ]);

    return successResponse({
      data: books,
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
    return errorResponse("Erro ao listar livros", 500);
  }
}

// POST /api/books - Criar livro manualmente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados
    const validatedData = bookSchema.parse(body);

    // Criar livro
    const book = await prisma.book.create({
      data: validatedData,
    });

    return successResponse(book, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return handleValidationError(error);
    }
    if (error.code === "P2002") {
      return errorResponse("ISBN já existe", 409);
    }
    return errorResponse("Erro ao criar livro", 500);
  }
}