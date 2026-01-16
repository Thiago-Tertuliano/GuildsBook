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
import { Input } from "@/components/input";
import { useMutationApi } from "@/hooks/use-api";

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  onSuccess?: () => void;
}

export function CreateDiscussionModal({
  isOpen,
  onClose,
  clubId,
  onSuccess,
}: CreateDiscussionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createMutation = useMutationApi(
    ["clubs", clubId, "discussions"],
    `/api/clubs/${clubId}/discussions`,
    "POST"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Por favor, insira um título para a discussão");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        content: content.trim() || undefined,
      });
      setTitle("");
      setContent("");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      alert(error.message || "Erro ao criar discussão");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Discussão</DialogTitle>
          <DialogDescription>
            Inicie uma nova discussão no clube de leitura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Discussão sobre o capítulo 1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Conteúdo (opcional)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Adicione detalhes sobre a discussão..."
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !title.trim()}>
              {createMutation.isPending ? "Criando..." : "Criar Discussão"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
