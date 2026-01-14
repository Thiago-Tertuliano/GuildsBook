import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Função para tratar erros de validação
export function handleValidationError(error: ZodError) {
  return NextResponse.json(
    {
      success: false,
      error: "Erro de validação",
      details: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    },
    { status: 400 }
  );
}

// Função para criar resposta de sucesso
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

// Função para criar resposta de erro
export function errorResponse(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}