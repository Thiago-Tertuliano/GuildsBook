"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { QuoteForm } from "@/components/quote-form";

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  onSuccess: () => void;
}

export function AddQuoteModal({
  isOpen,
  onClose,
  bookId,
  onSuccess,
}: AddQuoteModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Citação</DialogTitle>
          <DialogDescription>
            Adicione uma citação deste livro à sua coleção.
          </DialogDescription>
        </DialogHeader>

        <QuoteForm
          bookId={bookId}
          onSubmit={handleSuccess}
          onCancel={onClose}
          mode="create"
        />
      </DialogContent>
    </Dialog>
  );
}