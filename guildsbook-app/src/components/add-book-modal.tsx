"use client";

import { useState } from "react";
import Image from "next/image";
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
import { BookOpen, Search, Plus, X, Check, TrendingUp, CheckCircle2 } from "lucide-react";

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
      <DialogContent className="max-w-4xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#8d6f29' }}>
        <DialogHeader className="space-y-2 sm:space-y-3 pb-4 sm:pb-6 border-b border-white/10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: '#7a5f23' }}>
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-2xl text-white font-bold leading-tight">
                Adicionar Livro à Biblioteca
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base mt-2 sm:mt-3" style={{ color: '#f5ead9' }}>
                Busque e selecione um livro para adicionar à sua biblioteca pessoal.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Coluna Esquerda - Busca e Status */}
            <div className="md:col-span-1 space-y-4 sm:space-y-5">
              {/* Busca */}
              <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#e8d9b8' }} />
                  <label className="text-sm sm:text-base font-bold" style={{ color: '#f5ead9' }}>
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

              {/* Status Selection */}
              {selectedBookId && (
                <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#e8d9b8' }} />
                    <label className="text-sm sm:text-base font-bold" style={{ color: '#f5ead9' }}>
                      Status Inicial
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus("QUERO_LER")}
                      className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                        status === "QUERO_LER"
                          ? "text-white shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                      style={status === "QUERO_LER" ? { backgroundColor: '#5e4318' } : {}}
                    >
                      {status === "QUERO_LER" && <CheckCircle2 className="h-4 w-4" />}
                      Quero Ler
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("LENDO")}
                      className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                        status === "LENDO"
                          ? "text-white shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                      style={status === "LENDO" ? { backgroundColor: '#5e4318' } : {}}
                    >
                      {status === "LENDO" && <CheckCircle2 className="h-4 w-4" />}
                      Lendo
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("LIDO")}
                      className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                        status === "LIDO"
                          ? "text-white shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                      style={status === "LIDO" ? { backgroundColor: '#5e4318' } : {}}
                    >
                      {status === "LIDO" && <CheckCircle2 className="h-4 w-4" />}
                      Lido
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita - Resultados */}
            <div className="md:col-span-2 space-y-4 sm:space-y-5">
              {isSearching && (
                <div className="py-12 flex justify-center p-5 rounded-2xl" style={{ backgroundColor: '#7a5f23' }}>
                  <Loading text="Buscando livros..." />
                </div>
              )}

              {!isSearching && searchQuery && books.length === 0 && (
                <div className="py-12 text-center text-sm rounded-2xl" style={{ color: '#e8d9b8', backgroundColor: '#7a5f23' }}>
                  Nenhum livro encontrado.
                </div>
              )}

              {!isSearching && books.length > 0 && (
                <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#e8d9b8' }} />
                    <label className="text-sm sm:text-base font-bold" style={{ color: '#f5ead9' }}>
                      Resultados da Busca
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[300px] sm:max-h-[450px] overflow-y-auto rounded-lg sm:rounded-xl p-3 sm:p-4" style={{ backgroundColor: '#6b5420' }}>
                    {books.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => setSelectedBookId(book.id)}
                        className={`text-left p-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                          selectedBookId === book.id
                            ? "shadow-lg"
                            : "hover:bg-white/5"
                        }`}
                        style={
                          selectedBookId === book.id
                            ? { backgroundColor: '#5e4318' }
                            : { backgroundColor: '#7a5f23' }
                        }
                      >
                        <div className="flex items-center gap-3">
                          {selectedBookId === book.id && (
                            <div className="p-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#8d6f29' }}>
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                          {/* Capa do Livro */}
                          {book.cover ? (
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                              <Image
                                src={book.cover}
                                alt={book.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: '#6b5420' }}>
                              <BookOpen className="h-6 w-6" style={{ color: '#e8d9b8' }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-white truncate">{book.title}</div>
                            <div className="text-xs mt-1 truncate" style={{ color: '#e8d9b8' }}>{book.author}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!searchQuery && (
                <div className="py-12 text-center rounded-2xl" style={{ color: '#e8d9b8', backgroundColor: '#7a5f23' }}>
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" style={{ color: '#e8d9b8' }} />
                  <p className="text-sm">Digite uma busca para encontrar livros</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end pt-4 sm:pt-6 border-t border-white/10 mt-4 sm:mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 border-0 hover:bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedBookId || addBookMutation.isPending}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-white shadow-lg"
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
                  Adicionar à Biblioteca
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}