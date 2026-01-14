import { NextRequest } from "next/server";
import { searchGoogleBooks, syncGoogleBookToDatabase } from "@/lib/api/google-books";
import { successResponse, errorResponse } from "@/lib/api/utils";

// GET /api/books/external-search - Buscar livros na API do Google Books
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const maxResults = parseInt(searchParams.get("maxResults") || "20");
    const sync = searchParams.get("sync") === "true"; // Opcional: sincronizar com BD

    if (!query) {
      return errorResponse("Parâmetro 'q' (query) é obrigatório", 400);
    }

    // Buscar na API do Google Books
    const result = await searchGoogleBooks(query, maxResults);

    // Se sync=true, sincronizar os livros com nosso BD
    if (sync && result.books.length > 0) {
      const syncedBooks = await Promise.all(
        result.books.map((book) => syncGoogleBookToDatabase(book))
      );
      return successResponse({
        books: syncedBooks,
        totalItems: result.totalItems,
        synced: true,
      });
    }

    return successResponse({
      books: result.books,
      totalItems: result.totalItems,
      synced: false,
    });
  } catch (error: any) {
    console.error("Erro na busca externa:", error);
    return errorResponse("Erro ao buscar livros na API externa", 500);
  }
}