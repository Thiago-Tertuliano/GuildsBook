"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { BookOpen, Trash2 } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  isbn?: string | null;
  genre?: string | null;
  publishedYear?: number | null;
}

interface ReadingListItem {
  id: string;
  order: number;
  book: Book;
}

interface ReadingListItemsProps {
  items: ReadingListItem[];
  isOwner?: boolean;
  listId: string;
  onUpdate?: () => void;
}

export function ReadingListItems({
  items,
  isOwner,
  listId,
  onUpdate,
}: ReadingListItemsProps) {
  const handleDelete = async (itemId: string) => {
    if (!confirm("Tem certeza que deseja remover este livro da lista?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/reading-lists/${listId}/items?itemId=${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover livro");
      }

      onUpdate?.();
    } catch (error) {
      console.error("Erro ao remover livro:", error);
      alert("Erro ao remover livro. Tente novamente.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Esta lista ainda não tem livros.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="h-full hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex gap-4">
            <Link
              href={`/books/${item.book.id}`}
              className="relative w-20 h-28 flex-shrink-0 bg-muted rounded overflow-hidden"
            >
              {item.book.cover ? (
                <Image
                  src={item.book.cover}
                  alt={item.book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0 space-y-2">
              <Link href={`/books/${item.book.id}`} className="block">
                <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                  {item.book.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {item.book.author}
                </p>
              </Link>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {item.book.publishedYear && (
                  <span>{item.book.publishedYear}</span>
                )}
                {item.book.genre && (
                  <span className="px-2 py-1 bg-muted rounded">
                    {item.book.genre}
                  </span>
                )}
              </div>

              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remover
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}