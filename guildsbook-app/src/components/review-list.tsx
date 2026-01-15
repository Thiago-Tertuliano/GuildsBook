"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/review-card";
import { Card } from "@/components/card";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { useAuth } from "@/hooks/use-auth";
import { EditReviewModal } from "@/components/edit-review-modal";

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

interface ReviewsResponse {
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ReviewListProps {
  bookId: string;
}

export function ReviewList({ bookId }: ReviewListProps) {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGet<ReviewsResponse>(
    ["books", bookId, "reviews"],
    `/api/books/${bookId}/reviews?page=1&limit=20`
  );

  const reviews = reviewsData?.data?.data || [];

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta review?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}?userId=${user?.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar review");
      }
      refetch();
    } catch (error) {
      console.error("Erro ao deletar review:", error);
      alert("Erro ao deletar review. Tente novamente.");
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Erro ao curtir review");
      }
      refetch();
    } catch (error) {
      console.error("Erro ao curtir review:", error);
      alert("Erro ao curtir review. Tente novamente.");
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return <Loading text="Carregando reviews..." />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Erro ao carregar reviews"
        onRetry={refetch}
      />
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Ainda não há reviews para este livro. Seja o primeiro a avaliar!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        ))}
      </div>

      {editingReview && (
        <EditReviewModal
          isOpen={!!editingReview}
          onClose={() => setEditingReview(null)}
          review={editingReview}
          bookId={bookId}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}