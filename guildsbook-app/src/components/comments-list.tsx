"use client";

import { useState } from "react";
import { CommentItem } from "@/components/comment-item";
import { Card } from "@/components/card";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { useAuth } from "@/hooks/use-auth";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

interface CommentsResponse {
  data: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CommentsListProps {
  reviewId: string;
  onEdit?: (comment: Comment) => void;
}

export function CommentsList({ reviewId, onEdit }: CommentsListProps) {
  const { user } = useAuth();

  const {
    data: commentsData,
    isLoading,
    error,
    refetch,
  } = useGet<CommentsResponse>(
    ["reviews", reviewId, "comments"],
    `/api/reviews/${reviewId}/comments?page=1&limit=50`,
    !!reviewId
  );

  const comments = commentsData?.data?.data || [];

  const handleDelete = async (commentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}?userId=${user?.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar comentário");
      }
      refetch();
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      alert("Erro ao deletar comentário. Tente novamente.");
    }
  };

  if (isLoading) {
    return <Loading text="Carregando comentários..." />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Erro ao carregar comentários"
        onRetry={refetch}
      />
    );
  }

  if (comments.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}