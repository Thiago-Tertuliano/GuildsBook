import { z } from "zod";

// Schema para Book
export const bookSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    author: z.string().min(1, "Autor é obrigatório"),
    isbn: z.string().optional(),
    genre: z.string().optional(),
    publishedYear: z.number().int().positive().optional(),
    pages: z.number().positive().optional(),
    description: z.string().optional(),
});

// Schema para UserBook (status de leitura)
export const userBookSchema = z.object({
  bookId: z.string().uuid("ID do livro inválido"),
  status: z.enum(["QUERO_LER", "LENDO", "LIDO"]).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().optional(),
  currentPage: z.number().int().positive().optional(),
});

// Schema para Review (criação)
export const reviewSchema = z.object({
    bookId: z.string().uuid("ID do livro inválido"),
    content: z.string().min(10, "A review deve ter pelo menos 10 caracteres"),
    rating: z.number().int().min(1).max(5).optional(),
});

// Schema para atualização de Review
export const reviewUpdateSchema = z.object({
    content: z.string().min(10, "A review deve ter pelo menos 10 caracteres").optional(),
    rating: z.number().int().min(1).max(5).optional(),
});

// Schema para Comment (criação)
export const commentSchema = z.object({
    reviewId: z.string().uuid("ID da review inválida"),
    content: z.string().min(1, "O comentário não pode ser vazio"),
});

// Schema para atualização de Comment
export const commentUpdateSchema = z.object({
    content: z.string().min(1, "O comentário não pode ser vazio"),
});

// Schema para Paginação
export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});
    
