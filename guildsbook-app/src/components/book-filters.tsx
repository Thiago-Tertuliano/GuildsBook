"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Filter, X } from "lucide-react";

export type SortOption = "title_asc" | "title_desc" | "author_asc" | "author_desc" | "year_asc" | "year_desc" | "created_desc" | "created_asc";

interface BookFiltersProps {
  filters: {
    genre: string;
    year: string;
    publisher: string;
    language: string;
    sort: SortOption;
  };
  onFiltersChange: (filters: { genre: string; year: string; publisher: string; language: string; sort: SortOption }) => void;
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

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "created_desc", label: "Mais recentes" },
  { value: "created_asc", label: "Mais antigos" },
  { value: "title_asc", label: "Título A-Z" },
  { value: "title_desc", label: "Título Z-A" },
  { value: "author_asc", label: "Autor A-Z" },
  { value: "author_desc", label: "Autor Z-A" },
  { value: "year_desc", label: "Ano (mais recente)" },
  { value: "year_asc", label: "Ano (mais antigo)" },
];

const commonLanguages = [
  "Português",
  "Inglês",
  "Espanhol",
  "Francês",
  "Alemão",
  "Italiano",
  "Outro",
];

export function BookFilters({ filters, onFiltersChange }: BookFiltersProps) {
  const hasActiveFilters = filters.genre || filters.year || filters.publisher || filters.language || filters.sort !== "created_desc";

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

  const handlePublisherChange = (publisher: string) => {
    onFiltersChange({
      ...filters,
      publisher: publisher,
    });
  };

  const handleLanguageChange = (language: string) => {
    onFiltersChange({
      ...filters,
      language: filters.language === language ? "" : language,
    });
  };

  const handleSortChange = (sort: SortOption) => {
    onFiltersChange({
      ...filters,
      sort,
    });
  };

  const clearFilters = () => {
    onFiltersChange({ genre: "", year: "", publisher: "", language: "", sort: "created_desc" });
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
        {/* Ordenação */}
        <div>
          <h3 className="text-sm font-medium mb-3">Ordenar por</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.sort === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gênero */}
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

        {/* Ano de Publicação */}
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

        {/* Editora */}
        <div>
          <h3 className="text-sm font-medium mb-3">Editora</h3>
          <Input
            type="text"
            placeholder="Ex: Companhia das Letras"
            value={filters.publisher}
            onChange={(e) => handlePublisherChange(e.target.value)}
          />
        </div>

        {/* Idioma */}
        <div>
          <h3 className="text-sm font-medium mb-3">Idioma</h3>
          <div className="space-y-2">
            {commonLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.language === lang
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}