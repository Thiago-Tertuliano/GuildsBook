"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/card";
import { Button } from "@/components/button";
import { StarRating } from "@/components/star-rating";
import { Edit, Trash2, Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";

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

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  onLike?: (reviewId: string) => void;
}

export function ReviewCard({
  review,
  onEdit,
  onDelete,
  onLike,
}: ReviewCardProps) {
  const { user: currentUser } = useAuth();
  const isOwnReview = currentUser?.id === review.user.id;

  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/user/${review.user.id}`}>
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                {review.user.avatar ? (
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
            <div>
              <Link
                href={`/user/${review.user.id}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {review.user.name}
              </Link>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          {isOwnReview && (onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(review)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(review.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {review.rating && (
          <StarRating rating={review.rating} size="sm" />
        )}
        <p className="text-sm whitespace-pre-wrap">{review.content}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button
            onClick={() => onLike?.(review.id)}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Heart className="h-4 w-4" />
            <span>{review.likes}</span>
          </button>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{review._count.comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}