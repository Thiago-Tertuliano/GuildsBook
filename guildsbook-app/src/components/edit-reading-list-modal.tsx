"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { ReadingListForm } from "@/components/reading-list-form";
import { useMutationApi } from "@/hooks/use-api";
import { BookOpen } from "lucide-react";

interface ReadingList {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
}

interface EditReadingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: ReadingList;
  onSuccess: () => void;
}

export function EditReadingListModal({
  isOpen,
  onClose,
  list,
  onSuccess,
}: EditReadingListModalProps) {
  const updateMutation = useMutationApi(
    ["reading-lists", list.id],
    `/api/reading-lists/${list.id}`,
    "PUT"
  );

  const handleSubmit = async (data: { name: string; description?: string; isPublic: boolean }) => {
    try {
      await updateMutation.mutateAsync(data);
      onSuccess();
      onClose();
    } catch (error: any) {
      throw error;
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
                Editar Lista
              </DialogTitle>
              <DialogDescription className="text-base mt-3" style={{ color: '#f5ead9' }}>
                Atualize as informações da sua lista de leitura.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ReadingListForm
          initialData={list}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}