"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { BookOpen, Star, TrendingUp, Heart } from "lucide-react";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";

interface StatsResponse {
  totalBooks: number;
  booksRead: number;
  booksByStatus: {
    QUERO_LER: number;
    LENDO: number;
    LIDO: number;
  };
  totalPages: number;
  averageRating: number | null;
}

interface ProfileStatsProps {
  userId?: string;
  reviewCount?: number; // Adicionar prop opcional para reviews
}

export function ProfileStats({ userId, reviewCount }: ProfileStatsProps) {
  const { data: statsData, isLoading } = useGet<StatsResponse>(
    ["user", userId || "current", "stats"],
    userId ? `/api/user/${userId}/books/stats` : `/api/user/books/stats`,
    true
  );

  const stats = statsData?.data;

  if (isLoading) {
    return <Loading text="Carregando estatísticas..." />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBooks}</div>
          <p className="text-xs text-muted-foreground">
            {stats.booksByStatus.QUERO_LER} quero ler, {stats.booksByStatus.LENDO} lendo, {stats.booksRead} lidos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Livros Lidos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.booksRead}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalPages.toLocaleString("pt-BR")} páginas lidas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageRating ? stats.averageRating.toFixed(1) : "-"}
          </div>
          <p className="text-xs text-muted-foreground">de 5 estrelas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Páginas Lidas</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalPages.toLocaleString("pt-BR")}
          </div>
          <p className="text-xs text-muted-foreground">total de páginas</p>
        </CardContent>
      </Card>
    </div>
  );
}