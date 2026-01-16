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
import { BookOpen, Search, Plus, X, Check } from "lucide-react";

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
      <DialogContent className="max-w-4xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#8d6f29' }}>
        <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#7a5f23' }}>
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-white font-bold leading-tight">
                Adicionar Livro à Lista
              </DialogTitle>
              <DialogDescription className="text-base mt-3" style={{ color: '#f5ead9' }}>
                Busque e selecione um livro para adicionar à lista.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="pt-6">
          <div className="space-y-6">
            {/* Busca */}
            <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                <label className="text-base font-bold" style={{ color: '#f5ead9' }}>
                  Buscar Livro
                </label>
              </div>
              <div className="bg-white/10 rounded-xl p-2" style={{ backgroundColor: '#6b5420' }}>
                <BookSearchBar
                  onSearch={setSearchQuery}
                  placeholder="Digite o título, autor ou ISBN..."
                />
              </div>
            </div>

            {/* Resultados da Busca */}
            {isSearching && (
              <div className="py-8 flex justify-center">
                <Loading text="Buscando livros..." />
              </div>
            )}

            {!isSearching && searchQuery && books.length === 0 && (
              <div className="py-8 text-center text-sm rounded-2xl" style={{ color: '#e8d9b8', backgroundColor: '#7a5f23' }}>
                Nenhum livro encontrado.
              </div>
            )}

            {!isSearching && books.length > 0 && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto rounded-2xl p-4" style={{ backgroundColor: '#7a5f23' }}>
                {books.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                      selectedBookId === book.id
                        ? "shadow-lg"
                        : "hover:bg-white/5"
                    }`}
                    style={
                      selectedBookId === book.id
                        ? { backgroundColor: '#5e4318' }
                        : { backgroundColor: '#6b5420' }
                    }
                  >
                    <div className="flex items-center gap-3">
                      {selectedBookId === book.id && (
                        <div className="p-1.5 rounded-full" style={{ backgroundColor: '#7a5f23' }}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-base text-white">{book.title}</div>
                        <div className="text-sm mt-1" style={{ color: '#e8d9b8' }}>{book.author}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-6 border-t border-white/10 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 border-0 hover:bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedBookId || addBookMutation.isPending}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-white shadow-lg"
              style={{ backgroundColor: (!selectedBookId || addBookMutation.isPending) ? '#6b5420' : '#5e4318' }}
            >
              {addBookMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}