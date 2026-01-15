"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { StarRating } from "@/components/star-rating";
import { useMutationApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";

interface ReviewFormProps {
  bookId: string;
  initialRating?: number;
  initialContent?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  reviewId?: string;
}

export function ReviewForm({
  bookId,
  initialRating = 0,
  initialContent = "",
  onSubmit,
  onCancel,
  mode = "create",
  reviewId,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");

  const createMutation = useMutationApi(
    ["books", bookId, "reviews"],
    `/api/books/${bookId}/reviews`,
    "POST"
  );

  const updateMutation = useMutationApi(
    ["books", bookId, "reviews"],
    `/api/reviews/${reviewId}`,
    "PUT"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Você precisa estar autenticado para criar uma review");
      return;
    }

    if (content.length < 10) {
      setError("A review deve ter pelo menos 10 caracteres");
      return;
    }

    try {
      if (mode === "edit" && reviewId) {
        await updateMutation.mutateAsync({
          content,
          rating: rating > 0 ? rating : undefined,
        });
      } else {
        await createMutation.mutateAsync({
          userId: user.id,
          content,
          rating: rating > 0 ? rating : undefined,
        });
      }
      onSubmit();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Avaliação</label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Sua Review
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Compartilhe suas impressões sobre este livro..."
          required
        />
        <p className="text-xs text-muted-foreground">
          {content.length}/10 caracteres mínimos
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            createMutation.isPending ||
            updateMutation.isPending ||
            content.length < 10
          }
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Salvando..."
            : mode === "edit"
            ? "Atualizar"
            : "Publicar Review"}
        </Button>
      </div>
    </form>
  );
}