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
          <CardTitle className="text-xl text-foreground font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm0-3a1 1 0 112 0 1 1 0 01-2 0z" />
              </svg>
            </div>
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        </CardHeader>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Gráfico SVG - Centralizado */}
          <div className="relative flex-shrink-0">
            <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-90">
              {chartData.map((item, index) => (
                <path
                  key={index}
                  d={item.pathData}
                  fill={item.color}
                  stroke="hsl(var(--background))"
                  strokeWidth="3"
                  className="transition-all hover:opacity-90 hover:scale-105 cursor-pointer"
                  style={{
                    filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                    transformOrigin: "100px 100px",
                  }}
                />
              ))}
            </svg>
            
            {/* Número total no centro - Melhorado */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-card/80 backdrop-blur-sm rounded-full p-4 border-2 border-primary/20 shadow-lg">
                <div className="text-3xl font-bold text-foreground">{total}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">total</div>
              </div>
            </div>
          </div>

          {/* Legenda - Melhorada */}
          <div className="flex-1 space-y-3 w-full min-w-0">
            {chartData.map((item, index) => {
              const colors = [
                "from-primary/25 to-primary/15 border-primary/40 text-primary",
                "from-accent/25 to-accent/15 border-accent/40 text-accent",
                "from-secondary/25 to-secondary/15 border-secondary/40 text-secondary",
              ];
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r ${colors[index % colors.length]} border-2 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 shadow-lg ring-2 ring-white/60 group-hover:ring-white/80 transition-all"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.icon && (
                      <div className={`flex-shrink-0 ${colors[index % colors.length].split(' ')[3]}`}>
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-base ${colors[index % colors.length].split(' ')[3]}`}>
                        {item.label}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium mt-0.5">
                        {item.value} {item.value === 1 ? "livro" : "livros"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xl font-bold ${colors[index % colors.length].split(' ')[3]}`}>
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
