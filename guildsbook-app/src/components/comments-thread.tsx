"use client";

import { useState } from "react";
import { CommentsList } from "@/components/comments-list";
import { CommentForm } from "@/components/comment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/button";

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

interface CommentsThreadProps {
  reviewId: string;
  commentCount?: number;
}

export function CommentsThread({ reviewId, commentCount = 0 }: CommentsThreadProps) {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = () => {
    setEditingComment(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setIsExpanded(true);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        <span>
          {commentCount === 0
            ? "Comentar"
            : `${commentCount} ${commentCount === 1 ? "comentário" : "comentários"}`}
        </span>
      </button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentários
            {commentCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({commentCount})
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsExpanded(false);
              setEditingComment(null);
            }}
          >
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated && (
          <CommentForm
            reviewId={reviewId}
            initialContent={editingComment?.content || ""}
            mode={editingComment ? "edit" : "create"}
            commentId={editingComment?.id}
            onSubmit={handleSubmit}
            onCancel={editingComment ? () => setEditingComment(null) : undefined}
          />
        )}

        <CommentsList key={refreshKey} reviewId={reviewId} onEdit={handleEdit} />
      </CardContent>
    </Card>
  );
}