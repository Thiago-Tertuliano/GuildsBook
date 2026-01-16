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
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full min-h-screen relative overflow-hidden">
        {/* Background com gradientes coloridos */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Header melhorado com mais cores */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 flex items-center justify-center border-2 border-primary/30 shadow-lg">
              <Home className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                Bem-vindo de volta! Aqui está um resumo da sua atividade
              </p>
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
            avgRating={stats.avgRating}
          />
        )}

        {/* Grid de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráficos - Ocupa 2 colunas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico com filtros - mais colorido */}
            {!statsLoading && !statsError && stats && (
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="space-y-4 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-t-lg border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          Análise de Leitura
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">
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

            {/* Gráfico de Pizza - Lidos vs Não Lidos */}
            {!statsLoading && !statsError && stats && (
              <PieChart
                data={pieChartData}
                title=""
                description=""
              />
            )}

            {/* Atalhos Rápidos melhorados - mais coloridos */}
            <Card className="border-2 border-secondary/30 bg-gradient-to-br from-card via-card to-secondary/5 hover:shadow-xl transition-all duration-300 hover:border-primary/30">
              <CardHeader className="bg-gradient-to-r from-secondary/10 via-transparent to-primary/10 rounded-t-lg border-b border-secondary/20">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-md">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Atalhos Rápidos
                  </span>
                </CardTitle>
                <CardDescription className="text-base">Acesse rapidamente as principais funcionalidades</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    variant="outline" 
                    asChild 
                    className="h-auto flex-col py-6 gap-3 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 hover:border-primary/40 transition-all group border-2"
                  >
                    <Link href="/books">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all shadow-md group-hover:shadow-lg group-hover:scale-110">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-semibold text-primary group-hover:text-primary/90">Buscar Livros</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feed Recente - Ocupa 1 coluna - mais colorido */}
          <div className="space-y-4">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:shadow-xl transition-all duration-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-t-lg border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Atividade Recente
                    </span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary transition-colors rounded-lg">
                    <Link href="/feed" className="flex items-center gap-1 font-medium">
                      Ver tudo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription className="text-base">Últimas atividades da comunidade</CardDescription>
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

        {/* Estado vazio quando não há dados - mais colorido */}
        {!statsLoading && !statsError && !stats && (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
            <CardContent className="py-12 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 shadow-lg">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bem-vindo ao GuildsBook!
              </h3>
              <p className="text-muted-foreground mb-6 text-base max-w-md mx-auto">
                Comece adicionando livros à sua biblioteca para ver estatísticas e acompanhar seu progresso.
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all">
                <Link href="/books" className="flex items-center gap-2">
                  Buscar Livros
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
