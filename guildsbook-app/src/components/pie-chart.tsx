"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { useMemo } from "react";

interface PieChartData {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
  description?: string;
}

export function PieChart({ data, title, description }: PieChartProps) {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const chartData = useMemo(() => {
    let currentAngle = -90; // Começar no topo
    
    return data.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M 100 100`,
        `L ${x1} ${y1}`,
        `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");
      
      const currentAngleCopy = currentAngle;
      currentAngle += angle;
      
      return {
        ...item,
        percentage,
        pathData,
        angle: currentAngleCopy,
      };
    });
  }, [data, total]);

  if (total === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-secondary/5 shadow-xl hover:shadow-2xl transition-all duration-300">
      {title && (
        <CardHeader className="bg-gradient-to-r from-secondary/10 via-transparent to-primary/10 rounded-t-lg border-b border-secondary/20">
          <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm0-3a1 1 0 112 0 1 1 0 01-2 0z" />
              </svg>
            </div>
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Gráfico SVG */}
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              {chartData.map((item, index) => (
                <path
                  key={index}
                  d={item.pathData}
                  fill={item.color}
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  className="transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                />
              ))}
            </svg>
            
            {/* Número total no centro */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-xs text-muted-foreground">total</div>
              </div>
            </div>
          </div>

          {/* Legenda com mais cores */}
          <div className="flex-1 space-y-3 w-full">
            {chartData.map((item, index) => {
              const colors = [
                "from-primary/20 to-primary/10 border-primary/30",
                "from-accent/20 to-accent/10 border-accent/30",
                "from-secondary/20 to-secondary/10 border-secondary/30",
              ];
              const textColors = [
                "text-primary",
                "text-accent",
                "text-secondary",
              ];
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r ${colors[index % colors.length]} border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 shadow-md ring-2 ring-white/50"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.icon && (
                      <div className={`${textColors[index % textColors.length]}`}>{item.icon}</div>
                    )}
                    <div className="flex-1">
                      <div className={`font-semibold ${textColors[index % textColors.length]}`}>{item.label}</div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {item.value} {item.value === 1 ? "livro" : "livros"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${textColors[index % textColors.length]}`}>
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
