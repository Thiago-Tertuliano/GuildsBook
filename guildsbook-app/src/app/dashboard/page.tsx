"use client";

import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { StatsCards } from "@/components/stats-cards";
import { BooksChart } from "@/components/books-chart";
import { PieChart } from "@/components/pie-chart";
import { ChartFilter, ChartType } from "@/components/chart-filter";
import { ActivityItem } from "@/components/activity-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import Link from "next/link";
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  ArrowRight, 
  Star,
  TrendingUp,
  BookCheck,
  BookMarked
} from "lucide-react";
import { useState, useMemo } from "react";

interface StatsResponse {
  booksByMonth: Array<{ period: string; count: number }>;
  booksByYear: Array<{ year: string; count: number }>;
  favoriteGenres: Array<{ genre: string; count: number }>;
  totalPages: number;
  totalReadBooks: number;
  totalWantToRead: number;
  totalReading: number;
  avgPagesPerBook: number;
  favoriteBooks?: Array<{ id: string; title: string; author: string; rating: number }>;
  avgRating?: number;
  totalNotRead?: number;
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
  const [chartType, setChartType] = useState<ChartType>("read");

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

  // Dados para o gráfico de pizza (lidos vs não lidos)
  const pieChartData = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        label: "Livros Lidos",
        value: stats.totalReadBooks,
        color: "hsl(var(--primary))",
        icon: <BookCheck className="h-4 w-4" />,
      },
      {
        label: "Quero Ler",
        value: stats.totalWantToRead,
        color: "hsl(var(--accent))",
        icon: <BookMarked className="h-4 w-4" />,
      },
      {
        label: "Lendo Agora",
        value: stats.totalReading,
        color: "hsl(var(--secondary))",
        icon: <BookOpen className="h-4 w-4" />,
      },
    ];
  }, [stats]);

  // Dados para os gráficos baseados no filtro selecionado
  const chartData = useMemo(() => {
    if (!stats) return { data: [], title: "", type: "month" as const };

    switch (chartType) {
      case "read":
        return {
          data: stats.booksByMonth.slice(-6),
          title: "Livros Lidos - Últimos 6 Meses",
          type: "month" as const,
        };
      case "monthly":
        return {
          data: stats.booksByMonth.slice(-12),
          title: "Livros Lidos - Últimos 12 Meses",
          type: "month" as const,
        };
      case "favorites":
        // Usar dados mensais se houver, senão usar anuais
        return {
          data: stats.booksByMonth.slice(-6),
          title: "Progresso de Leitura",
          type: "month" as const,
        };
      default:
        return {
          data: stats.booksByMonth.slice(-6),
          title: "Livros Lidos - Últimos 6 Meses",
          type: "month" as const,
        };
    }
  }, [stats, chartType]);

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-8 space-y-8 w-full min-h-screen relative overflow-hidden">
        {/* Background com gradientes coloridos */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500" />
        </div>

        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/30 to-accent/30 flex items-center justify-center shadow-xl">
              <Home className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                Bem-vindo de volta! Aqui está um resumo da sua atividade
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
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
            avgRating={stats.avgRating}
          />
        )}

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Gráficos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de Barras */}
            {!statsLoading && !statsError && stats && (
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
                <CardHeader className="space-y-4 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-t-lg border-b border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        Análise de Leitura
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Visualize seus dados de diferentes formas
                      </CardDescription>
                    </div>
                  </div>
                  <ChartFilter
                    value={chartType}
                    onChange={setChartType}
                    availableTypes={["read", "monthly", "favorites"]}
                  />
                </CardHeader>
                <CardContent className="pt-6">
                  <BooksChart
                    data={chartData.data}
                    title={chartData.title}
                    type={chartData.type}
                    showDescription={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Gráfico de Pizza */}
            {!statsLoading && !statsError && stats && (
              <PieChart
                data={pieChartData}
                title=""
                description=""
              />
            )}
          </div>

          {/* Coluna Direita - Sidebar */}
          <div className="space-y-6">
            {/* Atividade Recente */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-t-lg border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-foreground font-bold">
                      Atividade Recente
                    </span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary transition-colors rounded-lg">
                    <Link href="/feed" className="flex items-center gap-1 font-medium text-sm">
                      Ver tudo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription className="text-base mt-2">
                  Últimas atividades da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {feedLoading && (
                  <div className="py-8">
                    <Loading text="Carregando..." />
                  </div>
                )}
                
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
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-muted-foreground" />
                    </div>
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
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
            <CardContent className="py-16 text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 border-2 border-primary/40 shadow-xl">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bem-vindo ao GuildsBook!
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Comece adicionando livros à sua biblioteca para ver estatísticas e acompanhar seu progresso.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base">
                <Link href="/books" className="flex items-center gap-2">
                  Buscar Livros
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
