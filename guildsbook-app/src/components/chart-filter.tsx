"use client";

import { Button } from "@/components/button";
import { BookOpen, Star, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChartType = "read" | "favorites" | "average" | "monthly" | "genres";

interface ChartFilterProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
  availableTypes?: ChartType[];
}

const chartTypes: Record<
  ChartType,
  { label: string; icon: React.ReactNode; description: string }
> = {
  read: {
    label: "Livros Lidos",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Evolução de livros lidos ao longo do tempo",
  },
  favorites: {
    label: "Favoritos",
    icon: <Star className="h-4 w-4" />,
    description: "Livros favoritos por período",
  },
  average: {
    label: "Média de Leitura",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Média de livros por período",
  },
  monthly: {
    label: "Por Mês",
    icon: <Calendar className="h-4 w-4" />,
    description: "Distribuição mensal",
  },
  genres: {
    label: "Gêneros",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Livros por gênero",
  },
};

export function ChartFilter({
  value,
  onChange,
  availableTypes = ["read", "favorites", "average", "monthly"],
}: ChartFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {availableTypes.map((type) => {
        const chartType = chartTypes[type];
        const isActive = value === type;

        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(type)}
            className={cn(
              "gap-2 transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted"
            )}
            title={chartType.description}
          >
            {chartType.icon}
            <span>{chartType.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
