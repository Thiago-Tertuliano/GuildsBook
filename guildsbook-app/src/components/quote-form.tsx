"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useMutationApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";

interface QuoteFormProps {
  bookId: string;
  initialContent?: string;
  initialPage?: number | null;
  initialChapter?: string | null;
  initialIsPublic?: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
  quoteId?: string;
}

export function QuoteForm({
  bookId,
  initialContent = "",
  initialPage = null,
  initialChapter = null,
  initialIsPublic = false,
  onSubmit,
  onCancel,
  mode = "create",
  quoteId,
}: QuoteFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [page, setPage] = useState(initialPage?.toString() || "");
  const [chapter, setChapter] = useState(initialChapter || "");
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [error, setError] = useState("");

  useEffect(() => {
    setContent(initialContent);
    setPage(initialPage?.toString() || "");
    setChapter(initialChapter || "");
    setIsPublic(initialIsPublic ?? false);
  }, [initialContent, initialPage, initialChapter, initialIsPublic]);

  const createMutation = useMutationApi(
    ["quotes"],
    "/api/quotes",
    "POST"
  );

  const updateMutation = useMutationApi(
    ["quotes", quoteId || ""],
    `/api/quotes/${quoteId}`,
    "PUT"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Você precisa estar autenticado para criar uma citação");
      return;
    }

    if (!content.trim()) {
      setError("A citação não pode ser vazia");
      return;
    }

    if (content.length > 2000) {
      setError("A citação deve ter no máximo 2000 caracteres");
      return;
    }

    try {
      const data: any = {
        bookId,
        content: content.trim(),
        isPublic,
      };

      if (page && !isNaN(parseInt(page))) {
        data.page = parseInt(page);
      }

      if (chapter.trim()) {
        data.chapter = chapter.trim();
      }

      if (mode === "edit" && quoteId) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      onSubmit();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar citação");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Citação *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite a citação..."
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground">
          {content.length}/2000 caracteres
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="page" className="text-sm font-medium">
            Página
          </label>
          <Input
            id="page"
            type="number"
            min="1"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="Ex: 42"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="chapter" className="text-sm font-medium">
            Capítulo
          </label>
          <Input
            id="chapter"
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Ex: Capítulo 1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
          Citação pública (outros usuários podem ver)
        </label>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading || !content.trim()}>
          {isLoading
            ? "Salvando..."
            : mode === "edit"
            ? "Atualizar"
            : "Criar Citação"}
        </Button>
      </div>
    </form>
  );
}