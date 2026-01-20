"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/input";
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
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBookId, setSelectedBookId] = useState<string>("");
    const [status, setStatus] = useState<BookStatus>("QUERO_LER");
  
    // Debounce da busca - busca automática após 500ms sem digitar
    useEffect(() => {
      const timer = setTimeout(() => {
        setSearchQuery(searchInput.trim());
      }, 500);

      return () => clearTimeout(timer);
    }, [searchInput]);

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
        setSearchInput("");
        setSearchQuery("");
        setSelectedBookId("");
        setStatus("QUERO_LER");
      } catch (error) {
        console.error("Erro ao adicionar livro:", error);
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl shadow-2xl overflow-hidden p-0 gap-0" style={{ backgroundColor: '#8d6f29' }}>
        {/* Header */}
        <DialogHeader className="space-y-2 sm:space-y-3 pb-4 sm:pb-6 border-b border-white/10 px-4 pt-4 sm:px-6 sm:pt-6">
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

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto overscroll-contain max-h-[calc(100vh-250px)] sm:max-h-[calc(85vh-150px)] px-4 sm:px-6">
          <form id="add-book-form" onSubmit={handleSubmit} className="pt-4 sm:pt-6 pb-4 sm:pb-6">
            {/* Busca Proeminente */}
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por título, autor ou ISBN..."
                  className="w-full pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl border-0 bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 text-white placeholder:text-white/50 transition-all duration-200"
                  style={{ backgroundColor: '#7a5f23' }}
                  autoFocus
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {searchInput && !isSearching && (
                <p className="text-xs sm:text-sm mt-2 ml-1" style={{ color: '#e8d9b8' }}>
                  {searchQuery ? "Resultados encontrados" : "Digitando..."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Status Selection - Mostrar apenas quando livro selecionado */}
              {selectedBookId && (
                <div className="lg:col-span-1">
                  <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-200" style={{ backgroundColor: '#7a5f23' }}>
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
                </div>
              )}

            {/* Resultados - Ocupar todo o espaço se status não estiver visível */}
            <div className={`${selectedBookId ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4 sm:space-y-5`}>
              {isSearching && (
                <div className="py-12 flex justify-center items-center p-5 rounded-2xl" style={{ backgroundColor: '#7a5f23' }}>
                  <Loading text="Buscando livros..." />
                </div>
              )}

              {!isSearching && searchQuery && books.length === 0 && (
                <div className="py-12 text-center rounded-2xl" style={{ color: '#e8d9b8', backgroundColor: '#7a5f23' }}>
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" style={{ color: '#e8d9b8' }} />
                  <p className="text-sm sm:text-base font-medium mb-1">Nenhum livro encontrado</p>
                  <p className="text-xs" style={{ color: '#e8d9b8' }}>Tente buscar com outros termos</p>
                </div>
              )}

              {!isSearching && books.length > 0 && (
                <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl" style={{ backgroundColor: '#7a5f23' }}>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#e8d9b8' }} />
                      <label className="text-sm sm:text-base font-bold" style={{ color: '#f5ead9' }}>
                        Resultados ({books.length})
                      </label>
                    </div>
                    {selectedBookId && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ color: '#e8d9b8', backgroundColor: '#6b5420' }}>
                        Livro selecionado
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto rounded-lg sm:rounded-xl p-3 sm:p-4 scrollbar-thin" style={{ backgroundColor: '#6b5420' }}>
                    {books.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => setSelectedBookId(book.id)}
                        className={`text-left p-3 sm:p-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] border-2 ${
                          selectedBookId === book.id
                            ? "shadow-lg border-white/30"
                            : "border-transparent hover:border-white/10 hover:bg-white/5"
                        }`}
                        style={
                          selectedBookId === book.id
                            ? { backgroundColor: '#5e4318' }
                            : { backgroundColor: '#7a5f23' }
                        }
                      >
                        <div className="flex items-start gap-3">
                          {/* Capa do Livro */}
                          {book.cover ? (
                            <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                              <Image
                                src={book.cover}
                                alt={book.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: '#6b5420' }}>
                              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: '#e8d9b8' }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {selectedBookId === book.id && (
                              <div className="flex items-center gap-1 mb-1">
                                <Check className="h-4 w-4 text-white" />
                                <span className="text-xs font-medium text-white">Selecionado</span>
                              </div>
                            )}
                            <div className="font-bold text-sm sm:text-base text-white line-clamp-2 mb-1">{book.title}</div>
                            <div className="text-xs sm:text-sm truncate" style={{ color: '#e8d9b8' }}>{book.author}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!searchInput && (
                <div className="py-12 text-center rounded-2xl" style={{ color: '#e8d9b8', backgroundColor: '#7a5f23' }}>
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" style={{ color: '#e8d9b8' }} />
                  <p className="text-sm sm:text-base font-medium">Comece digitando para buscar livros</p>
                  <p className="text-xs mt-1">Busque por título, autor ou ISBN</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}