"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { QuoteForm } from "@/components/quote-form";

interface Quote {
  id: string;
  content: string;
  page?: number | null;
  chapter?: string | null;
  isPublic: boolean;
  book: {
    id: string;
  };
}

interface EditQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onSuccess: () => void;
}

export function EditQuoteModal({
  isOpen,
  onClose,
  quote,
  onSuccess,
}: EditQuoteModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Citação</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da sua citação.
          </DialogDescription>
        </DialogHeader>

        <QuoteForm
          bookId={quote.book.id}
          quoteId={quote.id}
          initialContent={quote.content}
          initialPage={quote.page}
          initialChapter={quote.chapter}
          initialIsPublic={quote.isPublic}
          onSubmit={handleSuccess}
          onCancel={onClose}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}