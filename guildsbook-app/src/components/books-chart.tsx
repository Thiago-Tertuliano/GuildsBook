"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";

interface DataPoint {
  period: string;
  count: number;
}

interface BooksChartProps {
  data: DataPoint[];
  title: string;
  type: "month" | "year";
}

export function BooksChart({ data, title, type }: BooksChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Não há dados suficientes para exibir o gráfico.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const maxBarHeight = 200;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Gráfico de barras */}
          <div className="flex items-end gap-2 h-[220px] overflow-x-auto pb-4">
            {data.map((item) => {
              const height = maxCount > 0 ? (item.count / maxCount) * maxBarHeight : 0;
              const label =
                type === "month"
                  ? `${item.period.split("-")[1]}/${item.period.split("-")[0]}`
                  : item.period;

              return (
                <div
                  key={item.period}
                  className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[60px]"
                >
                  <div className="relative w-full flex flex-col items-center">
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary/80 min-h-[20px]"
                      style={{ height: `${height}px` }}
                      title={`${label}: ${item.count} livro${item.count !== 1 ? "s" : ""}`}
                    />
                    <span className="absolute -bottom-5 text-xs text-muted-foreground whitespace-nowrap">
                      {item.count}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-6 text-center">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legenda/Resumo */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de livros: </span>
                <span className="font-semibold">
                  {data.reduce((sum, item) => sum + item.count, 0)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Período médio: </span>
                <span className="font-semibold">
                  {maxCount > 0
                    ? Math.round(
                        data.reduce((sum, item) => sum + item.count, 0) / data.length
                      )
                    : 0}{" "}
                  livros
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
