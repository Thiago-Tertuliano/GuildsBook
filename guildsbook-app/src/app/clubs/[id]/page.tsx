"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { useGet, useMutationApi } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { DiscussionCard } from "@/components/discussion-card";
import { CreateDiscussionModal } from "@/components/create-discussion-modal";
import { Users, Lock, Globe, MessageSquare, Plus, LogOut } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";

interface BookClub {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  maxMembers?: number | null;
  memberCount?: number;
  discussionCount?: number;
  createdAt?: Date;
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  members: Array<{
    id: string;
    role: string;
    joinedAt: Date;
    user: {
      id: string;
      name: string;
      avatar?: string | null;
    };
  }>;
  isMember?: boolean;
  userRole?: string | null;
}

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

interface DiscussionsResponse {
  data: Discussion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ClubDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const clubId = params.id as string;
  const [isCreateDiscussionModalOpen, setIsCreateDiscussionModalOpen] = useState(false);

  const {
    data: clubData,
    isLoading: isLoadingClub,
    error: clubError,
    refetch: refetchClub,
  } = useGet<BookClub>(["clubs", clubId], `/api/clubs/${clubId}`, true);

  const {
    data: discussionsData,
    isLoading: isLoadingDiscussions,
    error: discussionsError,
    refetch: refetchDiscussions,
  } = useGet<DiscussionsResponse>(
    ["clubs", clubId, "discussions"],
    `/api/clubs/${clubId}/discussions?page=1&limit=50`,
    true
  );

  const leaveMutation = useMutationApi(
    ["clubs"],
    `/api/clubs/${clubId}/leave`,
    "DELETE"
  );

  const club = clubData?.data;
  const discussions = discussionsData?.data?.data || [];

  const handleLeave = async () => {
    if (
      !confirm(
        "Tem certeza que deseja sair deste clube? Você não poderá mais acessá-lo."
      )
    ) {
      return;
    }

    try {
      await leaveMutation.mutateAsync({});
      router.push("/clubs");
    } catch (error: any) {
      alert(error.message || "Erro ao sair do clube");
    }
  };

  if (isLoadingClub) {
    return (
      <Layout withSidebar>
        <div className="px-4 lg:pl-4 lg:pr-8 py-6 w-full">
          <Loading text="Carregando clube..." />
        </div>
      </Layout>
    );
  }

  if (clubError || !club) {
    return (
      <Layout withSidebar>
        <div className="px-4 lg:pl-4 lg:pr-8 py-6 w-full">
          <ErrorComponent
            onRetry={() => {
              refetchClub();
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        {/* Header do Clube */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">{club.name}</CardTitle>
                  <span title={club.isPublic ? "Público" : "Privado"}>
                    {club.isPublic ? (
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </span>
                </div>
                {club.description && (
                  <p className="text-muted-foreground mt-2">{club.description}</p>
                )}
                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {club.memberCount || club.members.length}{" "}
                      {club.maxMembers && `/ ${club.maxMembers} `}membros
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{club.discussionCount || 0} discussões</span>
                  </div>
                  <div>
                    Criado por <span className="font-medium">{club.owner.name}</span>
                  </div>
                  <div>
                    Criado em{" "}
                    {format(new Date(club.createdAt || Date.now()), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </div>
              </div>
              {club.isMember && club.userRole !== "OWNER" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLeave}
                  disabled={leaveMutation.isPending}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair do Clube
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Lista de Membros (opcional - pode ser expandida) */}
        {club.members.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {club.members.slice(0, 20).map((member) => (
                  <div
                    key={member.id}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {member.user.name}
                    {member.role === "OWNER" && (
                      <span className="text-primary ml-1">(Dono)</span>
                    )}
                  </div>
                ))}
                {club.memberCount && club.memberCount > 20 && (
                  <div className="px-3 py-1 bg-muted rounded-full text-sm">
                    +{club.memberCount - 20} outros
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fórum - Discussões */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Fórum</h2>
            {club.isMember && isAuthenticated && (
              <Button onClick={() => setIsCreateDiscussionModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Discussão
              </Button>
            )}
          </div>

          {isLoadingDiscussions && <Loading text="Carregando discussões..." />}

          {discussionsError && (
            <ErrorComponent
              onRetry={() => {
                refetchDiscussions();
              }}
            />
          )}

          {!isLoadingDiscussions && !discussionsError && (
            <>
              {discussions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma discussão ainda. Seja o primeiro a iniciar uma!
                    </p>
                    {club.isMember && isAuthenticated && (
                      <Button
                        className="mt-4"
                        onClick={() => setIsCreateDiscussionModalOpen(true)}
                      >
                        Criar Primeira Discussão
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <CreateDiscussionModal
          isOpen={isCreateDiscussionModalOpen}
          onClose={() => setIsCreateDiscussionModalOpen(false)}
          clubId={clubId}
          onSuccess={() => {
            refetchDiscussions();
            refetchClub();
          }}
        />
      </div>
    </Layout>
  );
}
