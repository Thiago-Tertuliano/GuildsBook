"use client";

import { useParams } from "next/navigation";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Button } from "@/components/button";
import { ReadingListItems } from "@/components/reading-list-items";
import { AddBookToListModal } from "@/components/add-book-to-list-modal";
import { EditReadingListModal } from "@/components/edit-reading-list-modal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { Plus, Globe, Lock, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

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

interface ReadingListDetails {
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
  readingListItems: ReadingListItem[];
  _count?: {
    readingListItems: number;
  };
}

export default function ReadingListDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const listId = params.id as string;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: listData,
    isLoading,
    error,
    refetch,
  } = useGet<ReadingListDetails>(
    ["reading-lists", listId],
    `/api/reading-lists/${listId}`,
    true
  );

  const list = listData?.data;
  const isOwner = list?.user.id === user?.id;

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        <Button variant="outline" size="sm" asChild>
          <Link href="/reading-lists">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Listas
          </Link>
        </Button>

        {isLoading && <Loading text="Carregando lista..." />}

        {error && (
          <ErrorComponent
            message="Erro ao carregar lista de leitura"
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && list && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
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
                    {list.description && (
                      <CardDescription className="text-base mt-2">
                        {list.description}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>Criado por {list.user.name}</span>
                      <span>•</span>
                      <span>{list.readingListItems.length} livros</span>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Livro
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            <ReadingListItems
              items={list.readingListItems}
              isOwner={isOwner}
              listId={listId}
              onUpdate={refetch}
            />

            {isOwner && (
              <>
                <AddBookToListModal
                  isOpen={isAddModalOpen}
                  onClose={() => setIsAddModalOpen(false)}
                  listId={listId}
                  onSuccess={() => {
                    setIsAddModalOpen(false);
                    refetch();
                  }}
                />

                {list && (
                  <EditReadingListModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    list={list}
                    onSuccess={() => {
                      setIsEditModalOpen(false);
                      refetch();
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}