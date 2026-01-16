"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { useMemo } from "react";

interface DataPoint {
  period: string;
  count: number;
}

interface BooksChartProps {
  data: DataPoint[];
  title: string;
  type: "month" | "year";
  color?: string;
  showDescription?: boolean;
}

export function BooksChart({ 
  data, 
  title, 
  type,
  color = "hsl(var(--primary))",
  showDescription = false,
}: BooksChartProps) {
  const maxCount = useMemo(() => {
    return Math.max(...data.map((d) => d.count), 0);
  }, [data]);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0);
  }, [data]);

  const average = useMemo(() => {
    return data.length > 0 ? Math.round(total / data.length) : 0;
  }, [data, total]);

  const maxBarHeight = 200;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {showDescription && (
            <CardDescription>Visualização dos seus dados de leitura</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              Não há dados suficientes para exibir o gráfico.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="hidden">
        <CardTitle>{title}</CardTitle>
        {showDescription && (
          <CardDescription>Visualização dos seus dados de leitura</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Gráfico de barras melhorado */}
          <div className="flex items-end gap-3 h-[240px] overflow-x-auto pb-6 px-2">
            {data.map((item, index) => {
              const height = maxCount > 0 ? (item.count / maxCount) * maxBarHeight : 0;
              const label =
                type === "month"
                  ? `${item.period.split("-")[1]}/${item.period.split("-")[0]}`
                  : item.period;

              // Cores vibrantes baseadas na posição
              const colorVariations = [
                { from: "hsl(var(--primary))", to: "hsl(var(--primary) / 0.7)" },
                { from: "hsl(var(--accent))", to: "hsl(var(--accent) / 0.7)" },
                { from: "hsl(var(--secondary))", to: "hsl(var(--secondary) / 0.7)" },
                { from: "hsl(var(--primary) / 0.9)", to: "hsl(var(--accent) / 0.7)" },
                { from: "hsl(var(--accent) / 0.9)", to: "hsl(var(--secondary) / 0.7)" },
                { from: "hsl(var(--secondary) / 0.9)", to: "hsl(var(--primary) / 0.7)" },
              ];
              const barColors = colorVariations[index % colorVariations.length];

              return (
                <div
                  key={item.period}
                  className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[70px] group"
                >
                  <div className="relative w-full flex flex-col items-center h-full">
                    {/* Barra com gradiente vibrante e animação */}
                    <div className="relative w-full">
                      <div
                        className="w-full rounded-t-lg transition-all duration-300 min-h-[20px] group-hover:shadow-xl group-hover:scale-110 border-2 border-white/20"
                        style={{
                          height: `${height}px`,
                          background: `linear-gradient(to top, ${barColors.from}, ${barColors.to})`,
                          boxShadow: `0 4px 12px ${barColors.from}40`,
                        }}
                        title={`${label}: ${item.count} livro${item.count !== 1 ? "s" : ""}`}
                      >
                        {/* Efeito de brilho no hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                        {/* Brilho sutil sempre visível */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-t-lg" />
                      </div>
                      {/* Valor no topo da barra */}
                      {item.count > 0 && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.count}
                        </span>
                      )}
                    </div>
                    {/* Valor abaixo da barra */}
                    <span className="absolute -bottom-5 text-xs font-medium text-foreground whitespace-nowrap">
                      {item.count}
                    </span>
                  </div>
                  {/* Label do período */}
                  <span className="text-xs text-muted-foreground mt-7 text-center font-medium">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Estatísticas resumidas - mais coloridas */}
          <div className="pt-4 border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl p-6 mt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="text-primary/70 text-xs uppercase tracking-wide mb-2 font-semibold">
                  Total
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{total}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">livros</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="text-accent/70 text-xs uppercase tracking-wide mb-2 font-semibold">
                  Média
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">{average}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">por período</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                <div className="text-secondary-foreground/70 text-xs uppercase tracking-wide mb-2 font-semibold">
                  Períodos
                </div>
                <div className="text-3xl font-bold text-foreground">{data.length}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">registrados</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
