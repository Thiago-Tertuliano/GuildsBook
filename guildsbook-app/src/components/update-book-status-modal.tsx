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
import { Star } from "lucide-react";

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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Livro: {book.book.title}</DialogTitle>
          <DialogDescription>
            Atualize o status, avaliação e progresso de leitura.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status */}
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

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Avaliação</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value === rating ? "" : value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      typeof rating === "number" && value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>


          {/* Current Page */}
          {book.book.pages && status === "LENDO" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Página Atual</label>
              <Input
                type="number"
                min="1"
                max={book.book.pages}
                value={currentPage}
                onChange={(e) =>
                  setCurrentPage(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                placeholder={`De 1 a ${book.book.pages}`}
              />
            </div>
          )}

          {/* Review */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Resenha (opcional)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Escreva sua resenha sobre o livro..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}