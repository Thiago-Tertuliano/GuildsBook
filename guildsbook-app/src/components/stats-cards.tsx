"use client";

import { Card, CardContent } from "@/components/card";
import { BookOpen, BookMarked, Eye, FileText } from "lucide-react";

interface StatsCardsProps {
  totalReadBooks: number;
  totalWantToRead: number;
  totalReading: number;
  totalPages: number;
  avgPagesPerBook: number;
}

export function StatsCards({
  totalReadBooks,
  totalWantToRead,
  totalReading,
  totalPages,
  avgPagesPerBook,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Livros Lidos",
      value: totalReadBooks,
      icon: BookOpen,
      description: "Total de livros finalizados",
    },
    {
      label: "Quero Ler",
      value: totalWantToRead,
      icon: BookMarked,
      description: "Livros na lista de desejos",
    },
    {
      label: "Lendo Agora",
      value: totalReading,
      icon: Eye,
      description: "Livros em leitura",
    },
    {
      label: "Páginas Lidas",
      value: totalPages.toLocaleString("pt-BR"),
      icon: FileText,
      description: `Média: ${avgPagesPerBook} págs/livro`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
