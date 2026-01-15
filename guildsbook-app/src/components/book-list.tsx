"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/card";
import { BookOpen, Calendar } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  isbn?: string | null;
  genre?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
}

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum livro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Link key={book.id} href={`/books/${book.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 flex gap-4">
              <div className="relative w-20 h-28 flex-shrink-0 bg-muted rounded overflow-hidden">
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {book.author}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {book.publishedYear && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{book.publishedYear}</span>
                    </div>
                  )}
                  {book.pages && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{book.pages} págs</span>
                    </div>
                  )}
                  {book.genre && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      {book.genre}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}