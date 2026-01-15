"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Filter, X } from "lucide-react";

interface BookFiltersProps {
  filters: {
    genre: string;
    year: string;
  };
  onFiltersChange: (filters: { genre: string; year: string }) => void;
}

const commonGenres = [
  "Ficção",
  "Não-ficção",
  "Romance",
  "Fantasia",
  "Ficção Científica",
  "Mistério",
  "Thriller",
  "Biografia",
  "História",
  "Autoajuda",
];

export function BookFilters({ filters, onFiltersChange }: BookFiltersProps) {
  const hasActiveFilters = filters.genre || filters.year;

  const handleGenreChange = (genre: string) => {
    onFiltersChange({
      ...filters,
      genre: filters.genre === genre ? "" : genre,
    });
  };

  const handleYearChange = (year: string) => {
    onFiltersChange({
      ...filters,
      year: year,
    });
  };

  const clearFilters = () => {
    onFiltersChange({ genre: "", year: "" });
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Gênero</h3>
          <div className="space-y-2">
            {commonGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.genre === genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Ano de Publicação</h3>
          <Input
            type="number"
            placeholder="Ex: 2020"
            value={filters.year}
            onChange={(e) => handleYearChange(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>
      </CardContent>
    </Card>
  );
}