"use client";

import { Card, CardContent } from "@/components/card";
import { 
  BookOpen, 
  BookMarked, 
  Eye, 
  FileText, 
  Star,
  TrendingUp,
  BookCheck,
  Library
} from "lucide-react";

interface StatsCardsProps {
  totalReadBooks: number;
  totalWantToRead: number;
  totalReading: number;
  totalPages: number;
  avgPagesPerBook: number;
  avgRating?: number;
}

export function StatsCards({
  totalReadBooks,
  totalWantToRead,
  totalReading,
  totalPages,
  avgPagesPerBook,
  avgRating = 0,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Livros Lidos",
      value: totalReadBooks,
      icon: BookCheck,
      description: "Total de livros finalizados",
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.1)",
      gradient: "from-amber-500/20 to-amber-600/10",
    },
    {
      label: "Quero Ler",
      value: totalWantToRead,
      icon: BookMarked,
      description: "Livros na lista de desejos",
      color: "hsl(var(--accent))",
      bgColor: "hsl(var(--accent) / 0.1)",
      gradient: "from-orange-600/20 to-orange-700/10",
    },
    {
      label: "Lendo Agora",
      value: totalReading,
      icon: Eye,
      description: "Livros em leitura",
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.1)",
      gradient: "from-yellow-500/20 to-yellow-600/10",
    },
    {
      label: "Páginas Lidas",
      value: totalPages.toLocaleString("pt-BR"),
      icon: FileText,
      description: `Média: ${avgPagesPerBook} págs/livro`,
      color: "hsl(var(--accent))",
      bgColor: "hsl(var(--accent) / 0.1)",
      gradient: "from-amber-700/20 to-amber-800/10",
    },
    {
      label: "Média de Avaliação",
      value: avgRating > 0 ? avgRating.toFixed(1) : "0.0",
      icon: Star,
      description: "Avaliação média dos livros",
      color: "hsl(var(--primary))",
      bgColor: "hsl(var(--primary) / 0.1)",
      gradient: "from-yellow-400/20 to-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.label}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
          >
            <CardContent className="p-6 relative overflow-hidden">
              {/* Gradiente de fundo sutil */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {stat.description}
                  </p>
                </div>
                <div 
                  className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ 
                    backgroundColor: stat.bgColor,
                  }}
                >
                  <Icon 
                    className="h-7 w-7 transition-colors duration-300" 
                    style={{ color: stat.color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
