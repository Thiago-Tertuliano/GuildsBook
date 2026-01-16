"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { BookClubCard } from "@/components/book-club-card";
import { CreateClubModal } from "@/components/create-club-modal";
import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface BookClub {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  maxMembers?: number | null;
  memberCount?: number;
  discussionCount?: number;
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  isMember?: boolean;
  userRole?: string | null;
}

interface ClubsResponse {
  data: BookClub[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ClubsPage() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"public" | "my" | "all">("public");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: clubsData,
    isLoading,
    error,
    refetch,
  } = useGet<ClubsResponse>(
    ["clubs", filter],
    `/api/clubs?filter=${filter}&page=1&limit=50`,
    true
  );

  const clubs = clubsData?.data?.data || [];

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Clubes de Leitura</h1>
          {isAuthenticated && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Clube
            </Button>
          )}
        </div>

        {/* Filtros */}
        {isAuthenticated && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "public" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("public")}
            >
              Públicos
            </Button>
            <Button
              variant={filter === "my" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("my")}
            >
              Meus Clubes
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todos
            </Button>
          </div>
        )}

        {isLoading && <Loading text="Carregando clubes..." />}

        {error && (
          <ErrorComponent
            onRetry={() => {
              refetch();
            }}
          />
        )}

        {!isLoading && !error && (
          <>
            {clubs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {filter === "public"
                    ? "Nenhum clube público encontrado."
                    : filter === "my"
                    ? "Você ainda não faz parte de nenhum clube."
                    : "Nenhum clube encontrado."}
                </p>
                {isAuthenticated && filter === "public" && (
                  <Button
                    className="mt-4"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Criar o primeiro clube
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clubs.map((club) => (
                  <BookClubCard
                    key={club.id}
                    club={club}
                    onUpdate={() => refetch()}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <CreateClubModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </Layout>
  );
}
