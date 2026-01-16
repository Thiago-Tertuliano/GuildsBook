"use client";

import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card } from "@/components/card";
import { ActivityItem } from "@/components/activity-item";
import { useAuth } from "@/hooks/use-auth";
import { Star } from "lucide-react";

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

export default function ReviewsPage() {
  const { user } = useAuth();
  
  const {
    data: feedData,
    isLoading,
    error,
    refetch,
  } = useGet<FeedResponse>(
    ["feed", "all"],
    `/api/feed?filter=all&page=1&limit=100`,
    true
  );

  const activities = feedData?.data?.data || [];

  // Filtrar apenas as reviews do usuário atual
  const myReviews = useMemo(() => {
    if (!user?.id) return [];
    return activities.filter((activity) => activity.user.id === user.id);
  }, [activities, user?.id]);

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
        <div className="flex items-center gap-3">
          <Star className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Minhas Avaliações</h1>
        </div>

        {isLoading && <Loading text="Carregando suas avaliações..." />}

        {error && (
          <ErrorComponent
            message="Erro ao carregar suas avaliações"
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (
          <>
            {myReviews.length === 0 ? (
              <Card className="p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Você ainda não fez nenhuma avaliação. Comece avaliando os livros que você leu!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myReviews.map((activity) => (
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
