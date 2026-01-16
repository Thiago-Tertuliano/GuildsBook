"use client";

import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { StatsCards } from "@/components/stats-cards";
import { BooksChart } from "@/components/books-chart";
import { GenresChart } from "@/components/genres-chart";
import { BarChart3 } from "lucide-react";

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

export default function StatsPage() {
  const {
    data: statsData,
    isLoading,
    error,
    refetch,
  } = useGet<StatsResponse>(["stats"], "/api/stats", true);

  const stats = statsData?.data;

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Minhas Estatísticas</h1>
        </div>

        {isLoading && <Loading text="Carregando estatísticas..." />}

        {error && (
          <ErrorComponent
            onRetry={() => {
              refetch();
            }}
          />
        )}

        {!isLoading && !error && stats && (
          <>
            {/* Cards de Estatísticas */}
            <StatsCards
              totalReadBooks={stats.totalReadBooks}
              totalWantToRead={stats.totalWantToRead}
              totalReading={stats.totalReading}
              totalPages={stats.totalPages}
              avgPagesPerBook={stats.avgPagesPerBook}
            />

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico por Mês */}
              <BooksChart
                data={stats.booksByMonth}
                title="Livros Lidos por Mês"
                type="month"
              />

              {/* Gráfico por Ano */}
              <BooksChart
                data={stats.booksByYear}
                title="Livros Lidos por Ano"
                type="year"
              />
            </div>

            {/* Gêneros Favoritos */}
            <GenresChart data={stats.favoriteGenres} />
          </>
        )}

        {!isLoading && !error && !stats && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Não há estatísticas disponíveis. Comece adicionando livros à sua
              biblioteca!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
