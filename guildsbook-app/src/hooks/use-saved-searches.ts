"use client";

import { useState, useEffect } from "react";
import { SortOption } from "@/components/book-filters";

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    genre: string;
    year: string;
    publisher: string;
    language: string;
    sort: SortOption;
  };
  createdAt: string;
}

const STORAGE_KEY = "guildsbook_saved_searches";

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    // Carregar do localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Erro ao carregar buscas salvas:", error);
      }
    }
  }, []);

  const saveSearch = (search: Omit<SavedSearch, "id" | "createdAt">) => {
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newSearch;
  };

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setSavedSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    clearAll,
  };
}