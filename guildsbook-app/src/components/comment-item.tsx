"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
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

interface CommentItemProps {
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const { user: currentUser } = useAuth();
  const isOwnComment = currentUser?.id === comment.user.id;

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Link href={`/user/${comment.user.id}`}>
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {comment.user.avatar ? (
                <Image
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/user/${comment.user.id}`}
                  className="font-semibold text-sm hover:text-primary transition-colors"
                >
                  {comment.user.name}
                </Link>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
              {isOwnComment && (onEdit || onDelete) && (
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(comment)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(comment.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}