"use client";

import { useState, useEffect } from "react";
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
import { useMutationApi } from "@/hooks/use-api";
import { UserIcon, FileText, MapPin, X, Save, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  location?: string | null;
  email: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSuccess: () => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSuccess,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setError("");
    }
  }, [isOpen, profile]);

  const updateMutation = useMutationApi(
    ["user", "profile"],
    "/api/user/profile",
    "PUT"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        await updateMutation.mutateAsync({
          name,
          bio: bio || undefined,
          location: location || undefined,
        });
        onSuccess();
        onClose();
      } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden" style={{ backgroundColor: '#c39738' }}>
        {/* Header Personalizado */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10" style={{ backgroundColor: '#8d6f29' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7a5f23' }}>
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Editar Perfil
              </DialogTitle>
              <DialogDescription className="text-sm mt-1" style={{ color: '#e8d9b8' }}>
                Atualize suas informações pessoais.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-5">
              {/* Nome */}
              <div className="space-y-3 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label htmlFor="name" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                    Nome Completo
                  </label>
                </div>
                <div className="bg-white/10 rounded-xl p-2" style={{ backgroundColor: '#6b5420' }}>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Digite seu nome completo"
                  />
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-5">
              {/* Bio */}
              <div className="space-y-3 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                    <label htmlFor="bio" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                      Bio
                    </label>
                  </div>
                  <span className="text-xs" style={{ color: '#e8d9b8' }}>
                    {bio.length}/500
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-2" style={{ backgroundColor: '#6b5420' }}>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        setBio(value);
                      }
                    }}
                    className="w-full min-h-[120px] rounded-lg border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-0 resize-none text-sm"
                    placeholder="Conte um pouco sobre você, seus interesses de leitura, gêneros favoritos..."
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-3 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: '#7a5f23' }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: '#e8d9b8' }} />
                  <label htmlFor="location" className="text-base font-bold" style={{ color: '#f5ead9' }}>
                    Localização
                  </label>
                </div>
                <div className="bg-white/10 rounded-xl p-2" style={{ backgroundColor: '#6b5420' }}>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Ex: São Paulo, Brasil"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl text-sm text-white" style={{ backgroundColor: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 border-0 hover:bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-white shadow-lg"
              style={{ backgroundColor: (!updateMutation.isPending) ? '#5e4318' : '#6b5420' }}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}