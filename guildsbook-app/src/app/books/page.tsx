"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { BookSearchBar } from "@/components/book-search-bar";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { BookList } from "@/components/book-list";
import { BookFilters } from "@/components/book-filters";
import { Card } from "@/components/card";
import { Button } from "@/components/button";

type SearchSource = "local" | "external" | "both";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  isbn?: string | null;
  genre?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
}

interface LocalBooksResponse {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ExternalBooksResponse {
  books: Book[];
  totalItems: number;
  synced: boolean;
}

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [source, setSource] = useState<SearchSource>("both");
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
  });

  // Busca local
  const {
    data: localData,
    isLoading: isLoadingLocal,
    error: localError,
    refetch: refetchLocal,
  } = useGet<LocalBooksResponse>(
    ["books", "search", "local", searchQuery, filters.genre, filters.year],
    searchQuery
      ? `/api/books/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=20`
      : `/api/books?page=1&limit=20`,
    true
  );

  // Busca externa - só busca se houver query
  const {
    data: externalData,
    isLoading: isLoadingExternal,
    error: externalError,
    refetch: refetchExternal,
  } = useGet<ExternalBooksResponse>(
    ["books", "search", "external", searchQuery],
    searchQuery
      ? `/api/books/external-search?q=${encodeURIComponent(searchQuery)}&maxResults=20&sync=false`
      : "",
    !!searchQuery
  );

  const isLoading = isLoadingLocal || isLoadingExternal;
  const hasError = !!localError || !!externalError;

  const getBooks = (): Book[] => {
    if (source === "local") {
      return (localData?.data?.data as Book[]) || [];
    }
    if (source === "external") {
      return (externalData?.data?.books as Book[]) || [];
    }
    // both: combinar resultados (remover duplicados por ISBN)
    const localBooks = (localData?.data?.data as Book[]) || [];
    const externalBooks = (externalData?.data?.books as Book[]) || [];
    const combined = [...localBooks, ...externalBooks];
    const unique = combined.filter(
      (book, index, self) =>
        index ===
        self.findIndex(
          (b) =>
            (b.isbn && book.isbn && b.isbn === book.isbn) || b.id === book.id
        )
    );
    return unique;
  };

  const books = getBooks();

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Buscar Livros</h1>
          <BookSearchBar
            onSearch={setSearchQuery}
            defaultValue={searchQuery}
          />
        </div>

        <div className="flex gap-6">
          <aside className="w-64">
            <BookFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  variant={source === "local" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource("local")}
                >
                  Banco Local
                </Button>
                <Button
                  variant={source === "external" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource("external")}
                >
                  Google Books
                </Button>
                <Button
                  variant={source === "both" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource("both")}
                >
                  Ambos
                </Button>
              </div>
            </div>

            {isLoading && <Loading text="Buscando livros..." />}

            {hasError && (
              <ErrorComponent
                onRetry={() => {
                  refetchLocal();
                  if (searchQuery) {
                    refetchExternal();
                  }
                }}
              />
            )}

            {!isLoading && !hasError && (
              <>
                {books.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "Nenhum livro encontrado."
                        : "Digite um termo de busca para começar."}
                    </p>
                  </Card>
                ) : (
                  <BookList books={books} />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}