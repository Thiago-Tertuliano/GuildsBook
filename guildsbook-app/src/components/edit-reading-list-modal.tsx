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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Lista</DialogTitle>
          <DialogDescription>
            Atualize as informações da sua lista de leitura.
          </DialogDescription>
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