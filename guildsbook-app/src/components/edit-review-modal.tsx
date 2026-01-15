"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { ReviewForm } from "@/components/review-form";

interface Review {
  id: string;
  content: string;
  rating?: number | null;
  likes: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  _count: {
    comments: number;
  };
}

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  bookId: string;
  onSuccess: () => void;
}

export function EditReviewModal({
  isOpen,
  onClose,
  review,
  bookId,
  onSuccess,
}: EditReviewModalProps) {
  if (!review) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Review</DialogTitle>
          <DialogDescription>
            Atualize sua avaliação e comentários sobre este livro.
          </DialogDescription>
        </DialogHeader>

        <ReviewForm
          bookId={bookId}
          reviewId={review.id}
          initialRating={review.rating || 0}
          initialContent={review.content}
          mode="edit"
          onSubmit={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}