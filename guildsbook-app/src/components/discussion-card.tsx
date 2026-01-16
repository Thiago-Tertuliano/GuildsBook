"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";

interface Discussion {
  id: string;
  title: string;
  content?: string | null;
  scheduledDate?: Date | null;
  createdAt: Date;
  creator: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  book?: {
    id: string;
    title: string;
    author: string;
    cover?: string | null;
  } | null;
}

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2">{discussion.title}</CardTitle>
            {discussion.content && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {discussion.content}
              </p>
            )}
          </div>
          {discussion.book && (
            <Link href={`/books/${discussion.book.id}`}>
              <div className="relative w-16 h-24 flex-shrink-0 bg-muted rounded overflow-hidden hover:opacity-80 transition-opacity">
                {discussion.book.cover ? (
                  <Image
                    src={discussion.book.cover}
                    alt={discussion.book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-center p-2">
                    {discussion.book.title}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{discussion.creator.name}</span>
            </div>
            {discussion.scheduledDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Agendada para{" "}
                  {format(new Date(discussion.scheduledDate), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            )}
          </div>
          <span>
            {format(new Date(discussion.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
