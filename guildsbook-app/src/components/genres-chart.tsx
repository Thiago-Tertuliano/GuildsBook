"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { BookOpen } from "lucide-react";

interface GenreData {
  genre: string;
  count: number;
}

interface GenresChartProps {
  data: GenreData[];
}

export function GenresChart({ data }: GenresChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gêneros Favoritos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Não há dados suficientes para exibir os gêneros.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const totalBooks = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gêneros Favoritos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Lista de gêneros com barras */}
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = (item.count / totalBooks) * 100;
              const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

              return (
                <div key={item.genre} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.genre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {item.count} livro{item.count !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumo */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>
                Total de {totalBooks} livro{totalBooks !== 1 ? "s" : ""} em{" "}
                {data.length} gênero{data.length !== 1 ? "s" : ""} diferentes
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
