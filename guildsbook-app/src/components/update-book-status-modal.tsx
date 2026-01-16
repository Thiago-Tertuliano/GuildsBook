"use client";

import { useState, useEffect } from "react";
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
import { useMutationApi } from "@/hooks/use-api";
import { BookStatus } from "@/types";
import { Star, BookOpen, TrendingUp, MessageSquare, Calendar, CheckCircle2 } from "lucide-react";

interface UserBook {
  id: string;
  status: BookStatus;
  rating?: number | null;
  review?: string | null;
  readDate?: Date | null;
  currentPage?: number | null;
  book: {
    id: string;
    title: string;
    author: string;
    pages?: number | null;
  };
}

interface UpdateBookStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: UserBook;
  onSuccess: () => void;
}

export function UpdateBookStatusModal({
  isOpen,
  onClose,
  book,
  onSuccess,
}: UpdateBookStatusModalProps) {
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [rating, setRating] = useState<number | "">(book.rating || "");
  const [currentPage, setCurrentPage] = useState<number | "">(
    book.currentPage || ""
  );
  const [review, setReview] = useState(book.review || "");

  useEffect(() => {
    if (isOpen) {
      setStatus(book.status);
      setRating(book.rating || "");
      setCurrentPage(book.currentPage || "");
      setReview(book.review || "");
    }
  }, [isOpen, book]);

  const updateMutation = useMutationApi(
    ["user", "books"],
    `/api/user/books/${book.book.id}`,
    "PUT"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        status,
        rating: rating === "" ? undefined : Number(rating),
        currentPage:
          currentPage === ""
            ? undefined
            : Number(currentPage),
        review: review || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
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
                {book.book.title}
              </DialogTitle>
              <p className="text-sm mt-1" style={{ color: '#e8d9b8' }}>por {book.book.author}</p>
              <DialogDescription className="text-base mt-3" style={{ color: '#f5ead9' }}>
                Atualize o status, avaliação e progresso de leitura
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-5">
              {/* Status */}
              <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label className="text-base font-bold" style={{ color: '#f5ead9' }}>Status de Leitura</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("QUERO_LER")}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                      status === "QUERO_LER"
                        ? "text-white shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    style={status === "QUERO_LER" ? { backgroundColor: '#5e4318' } : {}}
                  >
                    {status === "QUERO_LER" && <CheckCircle2 className="h-4 w-4 inline mr-1.5" />}
                    Quero Ler
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("LENDO")}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                      status === "LENDO"
                        ? "text-white shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    style={status === "LENDO" ? { backgroundColor: '#5e4318' } : {}}
                  >
                    {status === "LENDO" && <CheckCircle2 className="h-4 w-4 inline mr-1.5" />}
                    Lendo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("LIDO")}
                    className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                      status === "LIDO"
                        ? "text-white shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    style={status === "LIDO" ? { backgroundColor: '#5e4318' } : {}}
                  >
                    {status === "LIDO" && <CheckCircle2 className="h-4 w-4 inline mr-1.5" />}
                    Lido
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label className="text-base font-bold" style={{ color: '#f5ead9' }}>Sua Avaliação</label>
                  {typeof rating === "number" && (
                    <span className="text-sm font-medium" style={{ color: '#e8d9b8' }}>({rating}/5)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value === rating ? "" : value)}
                      className="focus:outline-none transition-all duration-200 transform hover:scale-125 active:scale-95"
                    >
                      <Star
                        className={`h-8 w-8 transition-all duration-200 ${
                          typeof rating === "number" && value <= rating
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                            : "text-white/30 hover:text-yellow-400/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Page */}
              {book.book.pages && status === "LENDO" && (
                <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                    <label className="text-base font-bold" style={{ color: '#f5ead9' }}>Progresso</label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min="1"
                      max={book.book.pages}
                      value={currentPage}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setCurrentPage("");
                          return;
                        }
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                          // Não permitir valores maiores que o total de páginas
                          if (numValue > (book.book.pages || 0)) {
                            setCurrentPage(book.book.pages || "");
                          } else if (numValue < 1) {
                            setCurrentPage(1);
                          } else {
                            setCurrentPage(numValue);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Garantir que o valor está dentro do range ao perder o foco
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          if (value > (book.book.pages || 0)) {
                            setCurrentPage(book.book.pages || "");
                          } else if (value < 1) {
                            setCurrentPage(1);
                          }
                        }
                      }}
                      placeholder={`Página atual (1 a ${book.book.pages})`}
                      className="bg-white/10 border-0 focus:ring-2 focus:ring-white/40 text-white placeholder:text-gray-300 text-base py-3 transition-all duration-200"
                      style={{ backgroundColor: '#6b5420' }}
                    />
                    {typeof currentPage === "number" && book.book.pages && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#e8d9b8' }}>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#6b5420' }}>
                          <div 
                            className="h-full transition-all duration-300 rounded-full"
                            style={{ 
                              backgroundColor: '#c39738',
                              width: `${Math.min(100, (currentPage / book.book.pages) * 100)}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round((currentPage / book.book.pages) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita - Review */}
            <div className="space-y-5">
              <div className="space-y-4 p-5 rounded-2xl h-full transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label className="text-base font-bold" style={{ color: '#f5ead9' }}>Resenha</label>
                  <span className="text-xs font-medium" style={{ color: '#e8d9b8' }}>(opcional)</span>
                </div>
                <div className="relative">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full h-[calc(100%-4rem)] min-h-[240px] rounded-xl border-0 px-5 py-4 text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200 text-white placeholder:text-gray-300"
                    style={{ backgroundColor: '#6b5420' }}
                    placeholder="Compartilhe seus pensamentos sobre o livro... O que mais gostou? O que achou da narrativa? Recomendaria para outros leitores?"
                  />
                  {review.length > 0 && (
                    <div className="absolute bottom-3 right-3 text-xs font-medium" style={{ color: '#e8d9b8' }}>
                      {review.length} caracteres
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-3 mt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="px-6 py-2.5 rounded-xl font-medium text-white border-0 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#6b5420' }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending} 
              className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg border-0 transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ backgroundColor: '#5e4318' }}
            >
              {updateMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Atualizar
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}