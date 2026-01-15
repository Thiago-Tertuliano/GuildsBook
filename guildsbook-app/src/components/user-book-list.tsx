"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { BookOpen, Calendar, Star, Edit, Trash2 } from "lucide-react";
import { BookStatus } from "@/types";


interface UserBook {
  id: string;
  status: BookStatus;
  rating?: number | null;
  review?: string | null;
  readDate?: Date | null;
  currentPage?: number | null;
  createdAt: Date;
  book: {
    id: string;
    title: string;
    author: string;
    cover?: string | null;
    isbn?: string | null;
    genre?: string | null;
    publishedYear?: number | null;
    pages?: number | null;
  };
}

interface UserBookListProps {
  books: UserBook[];
  onEdit: (book: UserBook) => void;
  onUpdate: () => void;
}

const statusLabels: Record<BookStatus, string> = {
  QUERO_LER: "Quero Ler",
  LENDO: "Lendo",
  LIDO: "Lido",
};

export function UserBookList({ books, onEdit, onUpdate }: UserBookListProps) {
    const handleDelete = async (bookId: string) => {
      if (!confirm("Tem certeza que deseja remover este livro da sua biblioteca?")) {
        return;
      }
  
      try {
        const response = await fetch(`/api/user/books/${bookId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Erro ao remover livro");
        }
        onUpdate();
      } catch (error) {
        console.error("Erro ao remover livro:", error);
        alert("Erro ao remover livro. Tente novamente.");
      }
    };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((userBook) => (
        <Card key={userBook.id} className="h-full hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex gap-4">
            <Link href={`/books/${userBook.book.id}`} className="relative w-20 h-28 flex-shrink-0 bg-muted rounded overflow-hidden">
              {userBook.book.cover ? (
                <Image
                  src={userBook.book.cover}
                  alt={userBook.book.title}
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
              <div className="flex items-start justify-between gap-2">
                <Link href={`/books/${userBook.book.id}`} className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {userBook.book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {userBook.book.author}
                  </p>
                </Link>
              </div>

              {/* Status Badge */}
              <div>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  {statusLabels[userBook.status]}
                </span>
              </div>

              {/* Rating */}
              {userBook.rating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{userBook.rating}/5</span>
                </div>
              )}

              {/* Current Page */}
              {userBook.currentPage && userBook.book.pages && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>
                    Página {userBook.currentPage} de {userBook.book.pages}
                  </span>
                </div>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {userBook.book.publishedYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{userBook.book.publishedYear}</span>
                  </div>
                )}
                {userBook.book.pages && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{userBook.book.pages} págs</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(userBook)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(userBook.book.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}