"use client";

import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { BookSearchBar } from "@/components/book-search-bar";
import { BookFilters, SortOption } from "@/components/book-filters"; // Adicionar import
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { BookList } from "@/components/book-list";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Filter, Bookmark, X } from "lucide-react";
import { useSavedSearches } from "@/hooks/use-saved-searches"; // Adicionar
import { SaveSearchModal } from "@/components/save-search-modal"; // Adicionar
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"; 

type SearchSource = "local" | "external" | "both";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  isbn?: string | null;
  genre?: string | null;
  publishedYear?: number | null;
  publisher?: string | null;
  language?: string | null;
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
  const [filters, setFilters] = useState<{
    genre: string;
    year: string;
    publisher: string;
    language: string;
    sort: SortOption;
  }>({
    genre: "",
    year: "",
    publisher: "",
    language: "",
    sort: "created_desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const { savedSearches, deleteSearch } = useSavedSearches();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Construir URL de busca com filtros e ordenação
  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (filters.genre) params.set("genre", filters.genre);
    if (filters.year) params.set("year", filters.year);
    if (filters.publisher) params.set("publisher", filters.publisher);
    if (filters.language) params.set("language", filters.language);
    params.set("sort", filters.sort);
    params.set("page", "1");
    params.set("limit", "20");
    return `/api/books/search?${params.toString()}`;
  };

  // Busca local
  const {
    data: localData,
    isLoading: isLoadingLocal,
    error: localError,
    refetch: refetchLocal,
  } = useGet<LocalBooksResponse>(
    ["books", "search", "local", searchQuery, filters.genre, filters.year, filters.publisher, filters.language, filters.sort],
    searchQuery || filters.genre || filters.year || filters.publisher || filters.language
      ? buildSearchUrl()
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

  // Aplicar filtros nos resultados
  const getBooks = (): Book[] => {
    let allBooks: Book[] = [];

    if (source === "local") {
      allBooks = (localData?.data?.data as Book[]) || [];
    } else if (source === "external") {
      allBooks = (externalData?.data?.books as Book[]) || [];
    } else {
      // both: combinar resultados (remover duplicados por ISBN)
      const localBooks = (localData?.data?.data as Book[]) || [];
      const externalBooks = (externalData?.data?.books as Book[]) || [];
      const combined = [...localBooks, ...externalBooks];
      allBooks = combined.filter(
        (book, index, self) =>
          index ===
          self.findIndex(
            (b) =>
              (b.isbn && book.isbn && b.isbn === book.isbn) || b.id === book.id
          )
      );
    }

    // Aplicar filtros (apenas para busca externa ou "both", pois busca local já filtra na API)
    if (source === "local") {
      // A busca local já vem filtrada da API
      return allBooks;
    }

    return allBooks.filter((book) => {
      if (filters.genre && book.genre !== filters.genre) {
        return false;
      }
      if (filters.year && book.publishedYear?.toString() !== filters.year) {
        return false;
      }
      if (filters.publisher && book.publisher && !book.publisher.toLowerCase().includes(filters.publisher.toLowerCase())) {
        return false;
      }
      if (filters.language && book.language !== filters.language) {
        return false;
      }
      return true;
    });
  };

  // Função para aplicar busca salva
  const applySavedSearch = (saved: any) => {
    setSearchQuery(saved.query);
    setFilters({
      genre: saved.filters.genre || "",
      year: saved.filters.year || "",
      publisher: saved.filters.publisher || "",
      language: saved.filters.language || "",
      sort: (saved.filters.sort || "created_desc") as SortOption,
    });
    setShowSavedSearches(false);
  };

  const books = useMemo(() => getBooks(), [
    localData,
    externalData,
    source,
    filters.genre,
    filters.year,
    filters.publisher,
    filters.language,
    filters.sort,
  ]);

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Buscar Livros</h1>
            <div className="flex gap-2">
              {/* Botão de buscas salvas */}
              <Dialog open={showSavedSearches} onOpenChange={setShowSavedSearches}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Buscas Salvas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buscas Favoritas</DialogTitle>
                    <DialogDescription>
                      Suas buscas salvas. Clique para aplicar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {savedSearches.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma busca salva.
                      </p>
                    ) : (
                      savedSearches.map((saved) => (
                        <div
                          key={saved.id}
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted transition-colors"
                        >
                          <button
                            onClick={() => applySavedSearch(saved)}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium">{saved.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {saved.query || "Sem busca de texto"}
                              {saved.filters.genre && ` • ${saved.filters.genre}`}
                              {saved.filters.year && ` • ${saved.filters.year}`}
                              {saved.filters.publisher && ` • ${saved.filters.publisher}`}
                              {saved.filters.language && ` • ${saved.filters.language}`}
                            </div>
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSearch(saved.id)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>

              {/* Botão de salvar busca */}
              {(searchQuery || filters.genre || filters.year || filters.publisher || filters.language) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSaveModalOpen(true)}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Salvar Busca
                </Button>
              )}
            </div>
          </div>
          <BookSearchBar
            onSearch={setSearchQuery}
            defaultValue={searchQuery}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filtros - Mobile: drawer, Desktop: sidebar */}
          <aside
            className={`
              ${showFilters ? "block" : "hidden lg:block"}
              w-full lg:w-64 flex-shrink-0
            `}
          >
            <BookFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          <main className="flex-1 min-w-0">
            {/* Botões de fonte - responsivos */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={source === "local" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource("local")}
                  className="flex-1 sm:flex-none"
                >
                  Local
                </Button>
                <Button
                  variant={source === "external" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource("external")}
                  className="flex-1 sm:flex-none"
                >
                  Google
                </Button>
                <Button
                  variant={source === "both" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource("both")}
                  className="flex-1 sm:flex-none"
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
                      {searchQuery || filters.genre || filters.year || filters.publisher || filters.language
                        ? "Nenhum livro encontrado com os filtros aplicados."
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

        {/* Modal de salvar busca */}
        <SaveSearchModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          query={searchQuery}
          filters={filters}
        />
      </div>
    </Layout>
  );
}