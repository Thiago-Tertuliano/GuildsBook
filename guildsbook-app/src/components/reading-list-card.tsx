"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { Button } from "@/components/button";
import { BookOpen, Lock, Globe, Edit, Trash2, User } from "lucide-react";
import { useMutationApi } from "@/hooks/use-api";

interface ReadingList {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  _count?: {
    items: number;
  };
}

interface ReadingListCardProps {
  list: ReadingList;
  isOwner?: boolean;
  onEdit?: (list: ReadingList) => void;
  onUpdate?: () => void;
}

export function ReadingListCard({ list, isOwner, onEdit, onUpdate }: ReadingListCardProps) {
  const deleteMutation = useMutationApi(
    ["reading-lists"],
    `/api/reading-lists/${list.id}`,
    "DELETE"
  );

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja deletar a lista "${list.name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({});
      onUpdate?.();
    } catch (error: any) {
      alert(error.message || "Erro ao deletar lista");
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2">{list.name}</CardTitle>
            {list.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {list.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{list.name}</CardTitle>
                      {list.isPublic ? (
                        <span title="Pública">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                        </span>
                      ) : (
                        <span title="Privada">
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        </span>
                      )}
                    </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{list._count?.items || 0} livros</span>
          </div>
          {!isOwner && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{list.user.name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/reading-lists/${list.id}`}>Ver Detalhes</Link>
          </Button>
          {isOwner && onEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(list)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}