"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

interface BookSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function BookSearchBar({
  onSearch,
  placeholder = "Buscar livros por título, autor ou ISBN...",
  defaultValue = "",
}: BookSearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>
      <Button type="button" onClick={() => handleSubmit()}>Buscar</Button>
    </div>
  );
}