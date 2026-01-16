"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { ActivityItem } from "@/components/activity-item";
import { useAuth } from "@/hooks/use-auth";

interface Activity {
  id: string;
  type: "review";
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
  content: string;
  rating?: number | null;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

interface FeedResponse {
  data: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type FeedFilter = "all" | "following";

export default function FeedPage() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<FeedFilter>("all");

  const {
    data: feedData,
    isLoading,
    error,
    refetch,
  } = useGet<FeedResponse>(
    ["feed", filter],
    `/api/feed?filter=${filter}&page=1&limit=20`,
    true
  );

  const activities = feedData?.data?.data || [];

  const handleFilterChange = (newFilter: FeedFilter) => {
    // Garantir que apenas usuários autenticados possam ver "following"
    if (newFilter === "following" && !isAuthenticated) {
      return;
    }
    setFilter(newFilter);
  };

  const handleLike = async (activityId: string) => {
    try {
      const response = await fetch(`/api/reviews/${activityId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Erro ao curtir review");
      }
      refetch();
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  };

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Feed</h1>
          {isAuthenticated && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                className="flex-1 sm:flex-none"
              >
                Todas
              </Button>
              <Button
                variant={filter === "following" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("following")}
                className="flex-1 sm:flex-none"
              >
                Seguindo
              </Button>
            </div>
          )}
        </div>

        {isLoading && <Loading text="Carregando feed..." />}

        {error && (
          <ErrorComponent
            message="Erro ao carregar feed"
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (
          <>
            {activities.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {filter === "following"
                    ? "Você não segue ninguém ainda ou não há atividades recentes das pessoas que você segue."
                    : "Ainda não há atividades no feed."}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onLike={handleLike}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}