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
import { MessageSquare, Edit3, X, Check } from "lucide-react";

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
      <DialogContent className="max-w-4xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#8d6f29' }}>
        <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#7a5f23' }}>
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-white font-bold leading-tight">
                Nova Discussão
              </DialogTitle>
              <DialogDescription className="text-base mt-3" style={{ color: '#f5ead9' }}>
                Inicie uma nova discussão no clube de leitura e compartilhe suas ideias com outros membros.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-5">
              {/* Título */}
              <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label htmlFor="title" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                    Título da Discussão *
                  </label>
                </div>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Discussão sobre o capítulo 1"
                  required
                  className="bg-white/10 border-0 focus:ring-2 focus:ring-white/40 text-white placeholder:text-gray-300 text-base py-3 transition-all duration-200"
                  style={{ backgroundColor: '#6b5420' }}
                />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-5">
              {/* Conteúdo */}
              <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01] h-full" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label htmlFor="content" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                    Conteúdo (opcional)
                  </label>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Adicione detalhes sobre a discussão, suas perguntas, tópicos que gostaria de abordar..."
                  className="w-full min-h-[280px] rounded-xl border-0 bg-white/10 focus:ring-2 focus:ring-white/40 text-white placeholder:text-gray-300 text-base px-4 py-3 transition-all duration-200 resize-none"
                  style={{ backgroundColor: '#6b5420' }}
                />
                {content.length > 0 && (
                  <p className="text-xs text-right" style={{ color: '#e8d9b8' }}>
                    {content.length} caracteres
                  </p>
                )}
              </div>
            </div>
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
              disabled={createMutation.isPending || !title.trim()}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-white shadow-lg"
              style={{ backgroundColor: createMutation.isPending || !title.trim() ? '#6b5420' : '#5e4318' }}
            >
              {createMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Criar Discussão
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
