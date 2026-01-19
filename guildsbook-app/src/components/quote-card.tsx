"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/card";
import { Button } from "@/components/button";
import { Edit, Trash2, Heart, BookOpen, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";

interface Quote {
  id: string;
  content: string;
  page?: number | null;
  chapter?: string | null;
  isPublic: boolean;
  likes: number;
  createdAt: string;
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
}

interface QuoteCardProps {
  quote: Quote;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
  onLike?: (quoteId: string) => void;
}

export function QuoteCard({
  quote,
  onEdit,
  onDelete,
  onLike,
}: QuoteCardProps) {
  const { user: currentUser } = useAuth();
  const isOwnQuote = currentUser?.id === quote.user.id;

  const formattedDate = formatDistanceToNow(new Date(quote.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  const handleLike = async () => {
    if (onLike) {
      onLike(quote.id);
    }
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar esta citação?")) {
      onDelete?.(quote.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/user/${quote.user.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                {quote.user.avatar ? (
                  <Image
                    src={quote.user.avatar}
                    alt={quote.user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {(quote.user.name && quote.user.name.length > 0 ? quote.user.name.charAt(0) : "U").toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="font-medium">{quote.user.name}</span>
              </Link>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{formattedDate}</span>
              {!quote.isPublic && (
                <span title="Privada">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </span>
              )}
            </div>

            <Link
              href={`/books/${quote.book.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              {quote.book.cover && (
                <Image
                  src={quote.book.cover}
                  alt={quote.book.title}
                  width={24}
                  height={32}
                  className="rounded object-cover"
                />
              )}
              <span className="font-medium">{quote.book.title}</span>
              <span>•</span>
              <span>{quote.book.author}</span>
            </Link>
          </div>

          {isOwnQuote && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(quote)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Citação */}
        <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-lg">
          "{quote.content}"
        </blockquote>

        {/* Metadados (página, capítulo) */}
        {(quote.page || quote.chapter) && (
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {quote.page && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>Página {quote.page}</span>
              </div>
            )}
            {quote.chapter && (
              <div className="flex items-center gap-1">
                <span>Capítulo: {quote.chapter}</span>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-2"
          >
            <Heart className={`h-4 w-4 ${quote.likes > 0 ? "fill-red-500 text-red-500" : ""}`} />
            <span>{quote.likes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}