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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Clube de Leitura</DialogTitle>
          <DialogDescription>
            Crie um clube para discutir livros com outros leitores.
          </DialogDescription>
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
