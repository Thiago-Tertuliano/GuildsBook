"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useSavedSearches } from "@/hooks/use-saved-searches";
import { SortOption } from "@/components/book-filters";

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  filters: {
    genre: string;
    year: string;
    publisher: string;
    language: string;
    sort: SortOption;
  };
}

export function SaveSearchModal({
  isOpen,
  onClose,
  query,
  filters,
}: SaveSearchModalProps) {
  const [name, setName] = useState("");
  const { saveSearch } = useSavedSearches();

  const handleSave = () => {
    if (!name.trim()) {
      alert("Por favor, insira um nome para a busca");
      return;
    }

    saveSearch({
      name: name.trim(),
      query,
      filters,
    });

    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Busca</DialogTitle>
          <DialogDescription>
            Dê um nome para esta busca e salve para acessar facilmente depois.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome da Busca *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Livros de Fantasia de 2020"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>

          {/* Preview da busca */}
          <div className="p-3 bg-muted rounded-md text-sm">
            <div className="font-medium mb-1">Prévia da busca:</div>
            <div className="text-muted-foreground">
              {query && <div>Texto: "{query}"</div>}
              {filters.genre && <div>Gênero: {filters.genre}</div>}
              {filters.year && <div>Ano: {filters.year}</div>}
              {filters.publisher && <div>Editora: {filters.publisher}</div>}
              {filters.language && <div>Idioma: {filters.language}</div>}
              {filters.sort && <div>Ordenação: {filters.sort}</div>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}