"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/card";
import { StarRating } from "@/components/star-rating";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  type: "review";
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  book: {
    id: string;
    title: string;
    author: string;
    cover?: string | null;
  };
  content: string;
  rating?: number | null;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

interface ActivityItemProps {
  activity: Activity;
  onLike?: (activityId: string) => void;
}

export function ActivityItem({ activity, onLike }: ActivityItemProps) {
  const formattedDate = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  if (activity.type === "review") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Link href={`/user/${activity.user.id}`}>
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {activity.user.avatar ? (
                  <Image
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                    {(activity.user.name && activity.user.name.length > 0 ? activity.user.name.charAt(0) : "U").toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/user/${activity.user.id}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {activity.user.name}
                </Link>
                <span className="text-muted-foreground">avaliou</span>
                <Link
                  href={`/books/${activity.book.id}`}
                  className="font-medium hover:text-primary transition-colors truncate"
                >
                  {activity.book.title}
                </Link>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-4">
            {activity.book.cover && (
              <Link
                href={`/books/${activity.book.id}`}
                className="relative w-16 h-24 flex-shrink-0 bg-muted rounded overflow-hidden"
              >
                <Image
                  src={activity.book.cover}
                  alt={activity.book.title}
                  fill
                  className="object-cover"
                />
              </Link>
            )}
            <div className="flex-1 space-y-2">
              <div>
                <Link
                  href={`/books/${activity.book.id}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {activity.book.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  por {activity.book.author}
                </p>
              </div>
              {activity.rating && (
                <StarRating rating={activity.rating} size="sm" />
              )}
            </div>
          </div>

          <p className="text-sm whitespace-pre-wrap line-clamp-4">
            {activity.content}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            <button
              onClick={() => onLike?.(activity.id)}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>{activity.likes}</span>
            </button>
            <Link
              href={`/books/${activity.book.id}#review-${activity.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{activity.commentsCount}</span>
            </Link>
            <Link
              href={`/books/${activity.book.id}`}
              className="ml-auto text-primary hover:underline text-sm"
            >
              Ver livro →
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}