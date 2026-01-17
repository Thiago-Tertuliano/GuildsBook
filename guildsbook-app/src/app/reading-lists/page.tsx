"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGet, useMutationApi } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Button } from "@/components/button";
import { ReadingListCard } from "@/components/reading-list-card";
import { ReadingListForm } from "@/components/reading-list-form";
import { EditReadingListModal } from "@/components/edit-reading-list-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { Plus, Globe, Lock, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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

interface ReadingListsResponse {
  data: ReadingList[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type ListFilter = "my" | "public";

export default function ReadingListsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<ListFilter>("my");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<ReadingList | null>(null);

  const {
    data: listsData,
    isLoading,
    error,
    refetch,
  } = useGet<ReadingListsResponse>(
    ["reading-lists", filter],
    `/api/reading-lists?filter=${filter}&page=1&limit=50`,
    true
  );

  const createMutation = useMutationApi(
    ["reading-lists"],
    "/api/reading-lists",
    "POST"
  );

  const lists = listsData?.data?.data || [];

  const handleCreate = async (data: { name: string; description?: string; isPublic: boolean }) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      refetch();
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Listas de Leitura</h1>
          {user && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Lista
            </Button>
          )}
        </div>

        {/* Filtros */}
        {user && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "my" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("my")}
              className="flex-1 sm:flex-none"
            >
              <Lock className="h-3 w-3 mr-1" />
              Minhas Listas
            </Button>
            <Button
              variant={filter === "public" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("public")}
              className="flex-1 sm:flex-none"
            >
              <Globe className="h-3 w-3 mr-1" />
              Listas Públicas
            </Button>
          </div>
        )}

        {isLoading && <Loading text="Carregando listas..." />}

        {error && (
          <ErrorComponent
            message="Erro ao carregar listas de leitura"
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (
          <>
            {lists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {filter === "my"
                    ? "Você ainda não criou nenhuma lista. Crie sua primeira lista!"
                    : "Nenhuma lista pública encontrada."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lists.map((list) => (
                  <ReadingListCard
                    key={list.id}
                    list={list}
                    isOwner={list.user.id === user?.id}
                    onEdit={setEditingList}
                    onUpdate={refetch}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal de Criação */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-4xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#8d6f29' }}>
            <DialogHeader className="space-y-3 pb-6 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#7a5f23' }}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl text-white font-bold leading-tight">
                    Criar Nova Lista
                  </DialogTitle>
                  <DialogDescription className="text-base mt-3" style={{ color: '#f5ead9' }}>
                    Crie uma lista personalizada para organizar seus livros.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <ReadingListForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        {editingList && (
          <EditReadingListModal
            isOpen={!!editingList}
            onClose={() => setEditingList(null)}
            list={editingList}
            onSuccess={() => {
              setEditingList(null);
              refetch();
            }}
          />
        )}
      </div>
    </Layout>
  );
}