"use client";

import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { StatsCards } from "@/components/stats-cards";
import { BooksChart } from "@/components/books-chart";
import { ActivityItem } from "@/components/activity-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import Link from "next/link";
import { Home, BookOpen, BarChart3, ArrowRight } from "lucide-react";

interface StatsResponse {
  booksByMonth: Array<{ period: string; count: number }>;
  booksByYear: Array<{ year: string; count: number }>;
  favoriteGenres: Array<{ genre: string; count: number }>;
  totalPages: number;
  totalReadBooks: number;
  totalWantToRead: number;
  totalReading: number;
  avgPagesPerBook: number;
}

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

export default function DashboardPage() {
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGet<StatsResponse>(["stats"], "/api/stats", true);

  const {
    data: feedData,
    isLoading: feedLoading,
    error: feedError,
    refetch: refetchFeed,
  } = useGet<FeedResponse>(["feed", "all", "1"], "/api/feed?page=1&limit=5", true);

  const stats = statsData?.data;
  const recentActivities = (feedData?.data?.data || []).slice(0, 5);

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo da sua atividade</p>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas Rápidas */}
        {statsLoading && <Loading text="Carregando estatísticas..." />}
        
        {statsError && (
          <ErrorComponent
            onRetry={() => {
              refetchStats();
            }}
          />
        )}

        {!statsLoading && !statsError && stats && (
          <StatsCards
            totalReadBooks={stats.totalReadBooks}
            totalWantToRead={stats.totalWantToRead}
            totalReading={stats.totalReading}
            totalPages={stats.totalPages}
            avgPagesPerBook={stats.avgPagesPerBook}
          />
        )}

        {/* Grid de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Leitura - Ocupa 2 colunas */}
          <div className="lg:col-span-2 space-y-6">
            {!statsLoading && !statsError && stats && (
              <BooksChart
                data={stats.booksByMonth.slice(-6)} // Últimos 6 meses
                title="Livros Lidos - Últimos 6 Meses"
                type="month"
              />
            )}

            {/* Atalhos Rápidos */}
            <Card>
              <CardHeader>
                <CardTitle>Atalhos Rápidos</CardTitle>
                <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" asChild className="h-auto flex-col py-6 gap-2">
                    <Link href="/books">
                      <BookOpen className="h-6 w-6" />
                      <span>Buscar Livros</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto flex-col py-6 gap-2">
                    <Link href="/stats">
                      <BarChart3 className="h-6 w-6" />
                      <span>Estatísticas</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed Recente - Ocupa 1 coluna */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Atividade Recente</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/feed">
                      Ver tudo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Últimas atividades da comunidade</CardDescription>
              </CardHeader>
              <CardContent>
                {feedLoading && <Loading text="Carregando..." />}
                
                {feedError && (
                  <ErrorComponent
                    onRetry={() => {
                      refetchFeed();
                    }}
                  />
                )}

                {!feedLoading && !feedError && recentActivities.length > 0 && (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}

                {!feedLoading && !feedError && recentActivities.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma atividade recente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Estado vazio quando não há dados */}
        {!statsLoading && !statsError && !stats && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Bem-vindo ao GuildsBook!</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando livros à sua biblioteca para ver estatísticas e acompanhar seu progresso.
              </p>
              <Button asChild>
                <Link href="/books">
                  Buscar Livros
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
