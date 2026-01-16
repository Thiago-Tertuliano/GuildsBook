"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

interface BookClub {
  id?: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  maxMembers?: number | null;
}

interface BookClubFormProps {
  initialData?: BookClub;
  onSubmit: (data: {
    name: string;
    description?: string;
    isPublic: boolean;
    maxMembers?: number;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BookClubForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookClubFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);
  const [maxMembers, setMaxMembers] = useState(
    initialData?.maxMembers?.toString() || ""
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setIsPublic(initialData.isPublic ?? true);
      setMaxMembers(initialData.maxMembers?.toString() || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      description: description || undefined,
      isPublic,
      maxMembers: maxMembers ? parseInt(maxMembers) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome do Clube *
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Leitura de Fantasia"
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
          placeholder="Descreva o propósito do clube..."
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="maxMembers" className="text-sm font-medium">
          Limite de Membros (opcional)
        </label>
        <Input
          id="maxMembers"
          type="number"
          min="1"
          max="1000"
          value={maxMembers}
          onChange={(e) => setMaxMembers(e.target.value)}
          placeholder="Deixe em branco para ilimitado"
        />
        <p className="text-xs text-muted-foreground">
          Número máximo de membros permitidos no clube
        </p>
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
          Clube público (qualquer pessoa pode encontrar e participar)
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar Clube"}
        </Button>
      </div>
    </form>
  );
}
