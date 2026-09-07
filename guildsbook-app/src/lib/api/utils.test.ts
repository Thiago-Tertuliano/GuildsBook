import { describe, expect, it } from "vitest";
import { ZodError, z } from "zod";
import {
  errorResponse,
  getErrorProps,
  handleValidationError,
  successResponse,
} from "@/lib/api/utils";
import {
  bookSchema,
  commentSchema,
  quoteSchema,
  readingListSchema,
  reviewSchema,
  userBookSchema,
} from "@/lib/api/schemas";
import { cn } from "@/lib/utils";

describe("getErrorProps", () => {
  it("extrai props de Error", () => {
    const err = new Error("falhou");
    err.name = "CustomError";
    expect(getErrorProps(err)).toMatchObject({
      name: "CustomError",
      message: "falhou",
    });
  });

  it("retorna objeto vazio para não-objetos", () => {
    expect(getErrorProps("boom")).toEqual({});
    expect(getErrorProps(null)).toEqual({});
    expect(getErrorProps(42)).toEqual({});
  });
});

describe("handleValidationError", () => {
  it("formata ZodError", async () => {
    const schema = z.object({ title: z.string().min(1) });
    const parsed = schema.safeParse({ title: "" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    const res = handleValidationError(parsed.error);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Erro de validação");
    expect(body.details.length).toBeGreaterThan(0);
  });

  it("aceita objeto com issues", async () => {
    const res = handleValidationError({
      issues: [{ path: ["email"], message: "inválido" }],
    });
    const body = await res.json();
    expect(body.details[0]).toEqual({ path: "email", message: "inválido" });
  });

  it("aceita unknown sem issues", async () => {
    const res = handleValidationError("x");
    const body = await res.json();
    expect(body.details).toEqual([]);
  });

  it("aceita ZodError instance", async () => {
    try {
      z.string().min(5).parse("ab");
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
      const res = handleValidationError(e);
      expect(res.status).toBe(400);
    }
  });
});

describe("successResponse / errorResponse", () => {
  it("successResponse retorna data", async () => {
    const res = successResponse({ id: "1" }, 201);
    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({
      success: true,
      data: { id: "1" },
    });
  });

  it("errorResponse retorna mensagem", async () => {
    const res = errorResponse("não autorizado", 401);
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      success: false,
      error: "não autorizado",
    });
  });
});

describe("schemas", () => {
  const uuid = "550e8400-e29b-41d4-a716-446655440000";

  it("bookSchema valida livro válido", () => {
    expect(bookSchema.parse({ title: "1984", author: "Orwell" })).toMatchObject(
      { title: "1984", author: "Orwell" }
    );
  });

  it("bookSchema rejeita título vazio", () => {
    expect(() => bookSchema.parse({ title: "", author: "X" })).toThrow();
  });

  it("userBookSchema valida status", () => {
    expect(
      userBookSchema.parse({ bookId: uuid, status: "LENDO", rating: 4 })
    ).toMatchObject({ status: "LENDO", rating: 4 });
  });

  it("reviewSchema exige conteúdo mínimo", () => {
    expect(() =>
      reviewSchema.parse({ bookId: uuid, content: "curto" })
    ).toThrow();
    expect(
      reviewSchema.parse({
        bookId: uuid,
        content: "Uma review com texto suficiente",
      })
    ).toBeTruthy();
  });

  it("commentSchema rejeita vazio", () => {
    expect(() =>
      commentSchema.parse({ reviewId: uuid, content: "" })
    ).toThrow();
  });

  it("readingListSchema aplica default isPublic", () => {
    expect(readingListSchema.parse({ name: "Favoritos" })).toMatchObject({
      name: "Favoritos",
      isPublic: false,
    });
  });

  it("quoteSchema valida limites", () => {
    expect(
      quoteSchema.parse({ bookId: uuid, content: "Citação clássica" })
    ).toMatchObject({ isPublic: false });
    expect(() =>
      quoteSchema.parse({ bookId: "not-uuid", content: "x" })
    ).toThrow();
  });
});

describe("cn", () => {
  it("mescla classes e resolve conflitos tailwind", () => {
    expect(cn("px-2", "px-4", false && "hidden", "text-sm")).toBe(
      "px-4 text-sm"
    );
  });
});
