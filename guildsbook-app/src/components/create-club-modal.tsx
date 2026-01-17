"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { BookClubForm } from "@/components/book-club-form";
import { useMutationApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClubModal({ isOpen, onClose }: CreateClubModalProps) {
  const router = useRouter();
  const createMutation = useMutationApi(["clubs"], "/api/clubs", "POST");

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    isPublic: boolean;
    maxMembers?: number;
  }) => {
    try {
      await createMutation.mutateAsync(data);
      onClose();
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Erro ao criar clube");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#8d6f29' }}>
        <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#7a5f23' }}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-white font-bold leading-tight">
                Criar Novo Clube de Leitura
              </DialogTitle>
              <DialogDescription className="text-base mt-3" style={{ color: '#f5ead9' }}>
                Crie um clube para discutir livros com outros leitores e compartilhar suas experiências de leitura.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <BookClubForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
