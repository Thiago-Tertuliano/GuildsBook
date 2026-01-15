"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useMutationApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";

interface CommentFormProps {
  reviewId: string;
  initialContent?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  commentId?: string;
}

export function CommentForm({
  reviewId,
  initialContent = "",
  onSubmit,
  onCancel,
  mode = "create",
  commentId,
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");

  const createMutation = useMutationApi(
    ["reviews", reviewId, "comments"],
    `/api/reviews/${reviewId}/comments`,
    "POST"
  );

  const updateMutation = useMutationApi(
    ["reviews", reviewId, "comments"],
    `/api/comments/${commentId}`,
    "PUT"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Você precisa estar autenticado para comentar");
      return;
    }

    if (!content.trim()) {
      setError("O comentário não pode ser vazio");
      return;
    }

    try {
      if (mode === "edit" && commentId) {
        await updateMutation.mutateAsync({
          content: content.trim(),
          userId: user.id,
        });
      } else {
        await createMutation.mutateAsync({
          userId: user.id,
          content: content.trim(),
        });
      }
      setContent("");
      onSubmit();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar comentário");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="space-y-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva um comentário..."
          className="w-full"
        />
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={
            !content.trim() ||
            createMutation.isPending ||
            updateMutation.isPending
          }
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Salvando..."
            : mode === "edit"
            ? "Atualizar"
            : "Comentar"}
        </Button>
      </div>
    </form>
  );
}