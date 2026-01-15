"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

interface ReadingList {
  id?: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
}

interface ReadingListFormProps {
  initialData?: ReadingList;
  onSubmit: (data: { name: string; description?: string; isPublic: boolean }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ReadingListForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReadingListFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setIsPublic(initialData.isPublic ?? false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description: description || undefined,
      isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome da Lista *
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Minha Lista de Favoritos"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva sua lista..."
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
          Lista pública (outros usuários podem ver)
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}