import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ErrorProps = { name?: string; message?: string; code?: string };

export function getErrorProps(error: unknown): ErrorProps {
  if (typeof error === "object" && error !== null) {
    return error as ErrorProps;
  }
  return {};
}

// Função para tratar erros de validação
export function handleValidationError(error: unknown) {
  const zodLike =
    error instanceof ZodError
      ? error
      : typeof error === "object" && error !== null
        ? (error as { issues?: unknown[]; errors?: unknown[] })
        : {};
  const errors =
    ("issues" in zodLike && zodLike.issues) ||
    ("errors" in zodLike && zodLike.errors) ||
    [];
  return NextResponse.json(
    {
      success: false,
      error: "Erro de validação",
      details: Array.isArray(errors)
        ? errors.map((err: unknown) => {
            const e = err as { path?: unknown; message?: string };
            return {
              path: Array.isArray(e?.path)
                ? e.path.join(".")
                : String(e?.path || ""),
              message: e?.message || "Erro de validação",
            };
          })
        : [],
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
