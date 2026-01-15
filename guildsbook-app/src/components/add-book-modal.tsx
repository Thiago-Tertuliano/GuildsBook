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
import { BookStatus } from "@/types";

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
  
  interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
  }
  
  export function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBookId, setSelectedBookId] = useState<string>("");
    const [status, setStatus] = useState<BookStatus>("QUERO_LER");
  
    const { data: searchResults, isLoading: isSearching } = useGet<BooksResponse>(
      ["books", "search", "modal", searchQuery],
      searchQuery ? `/api/books/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=10` : "",
      !!searchQuery
    );
  
    const addBookMutation = useMutationApi(
      ["user", "books"],
      "/api/user/books",
      "POST"
    );
  
    const books = searchResults?.data?.data || [];
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedBookId) return;
  
      try {
        await addBookMutation.mutateAsync({
          bookId: selectedBookId,
          status,
        });
        onSuccess();
        // Reset form
        setSearchQuery("");
        setSelectedBookId("");
        setStatus("QUERO_LER");
      } catch (error) {
        console.error("Erro ao adicionar livro:", error);
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Livro à Biblioteca</DialogTitle>
          <DialogDescription>
            Busque e selecione um livro para adicionar à sua biblioteca pessoal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Busca de Livros */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar Livro</label>
            <BookSearchBar
              onSearch={setSearchQuery}
              placeholder="Digite o título, autor ou ISBN..."
            />
          </div>

          {/* Resultados da Busca */}
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

          {/* Status Selection */}
          {selectedBookId && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={status === "QUERO_LER" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("QUERO_LER")}
                >
                  Quero Ler
                </Button>
                <Button
                  type="button"
                  variant={status === "LENDO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("LENDO")}
                >
                  Lendo
                </Button>
                <Button
                  type="button"
                  variant={status === "LIDO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("LIDO")}
                >
                  Lido
                </Button>
              </div>
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