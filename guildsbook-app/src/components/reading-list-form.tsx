"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FileText, Edit3, Globe, Lock, X, Check } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="pt-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Coluna Esquerda */}
        <div className="space-y-5">
          {/* Nome da Lista */}
          <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" style={{ color: '#e8d9b8' }} />
              <label htmlFor="name" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                Nome da Lista *
              </label>
            </div>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Minha Lista de Favoritos"
              required
              className="bg-white/10 border-0 focus:ring-2 focus:ring-white/40 text-white placeholder:text-gray-300 text-base py-3 transition-all duration-200"
              style={{ backgroundColor: '#6b5420' }}
            />
          </div>

          {/* Visibilidade */}
          <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="h-5 w-5" style={{ color: '#e8d9b8' }} />
              ) : (
                <Lock className="h-5 w-5" style={{ color: '#e8d9b8' }} />
              )}
              <label className="text-base font-bold" style={{ color: '#f5ead9' }}>
                Visibilidade
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                  isPublic
                    ? "text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                style={isPublic ? { backgroundColor: '#5e4318' } : {}}
              >
                {isPublic && <Check className="h-4 w-4" />}
                <Globe className="h-4 w-4" />
                Pública
              </button>
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 ${
                  !isPublic
                    ? "text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                style={!isPublic ? { backgroundColor: '#5e4318' } : {}}
              >
                {!isPublic && <Check className="h-4 w-4" />}
                <Lock className="h-4 w-4" />
                Privada
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-5">
          {/* Descrição */}
          <div className="space-y-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01] h-full" style={{ backgroundColor: '#7a5f23' }}>
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" style={{ color: '#e8d9b8' }} />
              <label htmlFor="description" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                Descrição
              </label>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva sua lista de leitura..."
              className="w-full min-h-[150px] rounded-xl border-0 bg-white/10 focus:ring-2 focus:ring-white/40 text-white placeholder:text-gray-300 text-base px-4 py-3 transition-all duration-200 resize-none"
              style={{ backgroundColor: '#6b5420' }}
            />
            {description.length > 0 && (
              <p className="text-xs text-right" style={{ color: '#e8d9b8' }}>
                {description.length} caracteres
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 justify-end pt-6 border-t border-white/10 mt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 border-0 hover:bg-white/10 text-white"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-white shadow-lg"
          style={{ backgroundColor: isLoading || !name.trim() ? '#6b5420' : '#5e4318' }}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {initialData ? "Atualizar" : "Criar Lista"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}