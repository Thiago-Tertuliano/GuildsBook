"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { Button } from "@/components/button";
import { BookSearchBar } from "@/components/book-search-bar";
import { useGet, useMutationApi } from "@/hooks/use-api";
import { Loading } from "@/components/loading";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  isbn?: string | null;
}

interface BooksResponse {
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AddBookToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  onSuccess: () => void;
}

export function AddBookToListModal({
  isOpen,
  onClose,
  listId,
  onSuccess,
}: AddBookToListModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string>("");

  const { data: searchResults, isLoading: isSearching } = useGet<BooksResponse>(
    ["books", "search", "list-modal", searchQuery],
    searchQuery ? `/api/books/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=10` : "",
    !!searchQuery
  );

  const addBookMutation = useMutationApi(
    ["reading-lists", listId, "items"],
    `/api/reading-lists/${listId}/items`,
    "POST"
  );

  const books = searchResults?.data?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) return;

    try {
      await addBookMutation.mutateAsync({
        bookId: selectedBookId,
      });
      onSuccess();
      setSearchQuery("");
      setSelectedBookId("");
    } catch (error: any) {
      alert(error.message || "Erro ao adicionar livro");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Livro à Lista</DialogTitle>
          <DialogDescription>
            Busque e selecione um livro para adicionar à lista.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar Livro</label>
            <BookSearchBar
              onSearch={setSearchQuery}
              placeholder="Digite o título, autor ou ISBN..."
            />
          </div>

          {isSearching && (
            <div className="py-4">
              <Loading text="Buscando livros..." />
            </div>
          )}

          {!isSearching && searchQuery && books.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Nenhum livro encontrado.
            </div>
          )}

          {!isSearching && books.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
              {books.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => setSelectedBookId(book.id)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selectedBookId === book.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-muted-foreground">{book.author}</div>
                </button>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedBookId || addBookMutation.isPending}
            >
              {addBookMutation.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}