"use client";

import { useCallback, useSyncExternalStore } from "react";
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

function readSavedSearches(): SavedSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SavedSearch[]) : [];
  } catch (error) {
    console.error("Erro ao carregar buscas salvas:", error);
    return [];
  }
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("guildsbook-saved-searches", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("guildsbook-saved-searches", onStoreChange);
  };
}

function getServerSnapshot(): SavedSearch[] {
  return [];
}

function notify() {
  window.dispatchEvent(new Event("guildsbook-saved-searches"));
}

export function useSavedSearches() {
  const savedSearches = useSyncExternalStore(
    subscribe,
    readSavedSearches,
    getServerSnapshot
  );

  const saveSearch = useCallback(
    (search: Omit<SavedSearch, "id" | "createdAt">) => {
      const newSearch: SavedSearch = {
        ...search,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...readSavedSearches(), newSearch];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notify();
      return newSearch;
    },
    []
  );

  const deleteSearch = useCallback((id: string) => {
    const updated = readSavedSearches().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notify();
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    notify();
  }, []);

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    clearAll,
  };
}
