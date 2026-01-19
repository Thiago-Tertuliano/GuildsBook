"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { ProfileStats } from "@/components/profile-stats";
import { Edit, MapPin, Mail, Calendar } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  location?: string | null;
  createdAt: string;
  _count: {
    userBooks: number;
    reviews: number;
    readingLists: number;
    followers: number;
    following: number;
  };
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGet<UserProfile>(
    ["user", "profile"],
    "/api/user/profile",
    isAuthenticated
  );

  const profile = profileData?.data;
  
  // Usar imagem da sessão (Google, etc.) como fallback se o avatar do banco estiver vazio
  const userAvatar = profile?.avatar || authUser?.image || null;

  // Redirecionar se não autenticado
  if (!authLoading && !isAuthenticated) {
    router.push("/auth/signin");
    return null;
  }

  if (isLoading || authLoading) {
    return (
      <Layout withSidebar>
        <div className="px-4 lg:pl-4 lg:pr-8 py-6 w-full">
          <Loading text="Carregando perfil..." />
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout withSidebar>
        <div className="px-4 lg:pl-4 lg:pr-8 py-6 w-full">
          <ErrorComponent
            message="Erro ao carregar perfil"
            onRetry={refetch}
          />
        </div>
      </Layout>
    );
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <Layout withSidebar>
      <div className="px-4 lg:pl-4 lg:pr-8 py-6 space-y-6 w-full">
        {/* Header do Perfil */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    unoptimized={userAvatar?.startsWith('http')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl md:text-4xl font-bold bg-primary/10 text-primary">
                    {(profile.name && profile.name.length > 0 ? profile.name.charAt(0) : "U").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    {profile.bio && (
                      <p className="text-muted-foreground mt-2">{profile.bio}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {joinedDate}</span>
                  </div>
                </div>

                <div className="flex gap-6 pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold">{profile._count.userBooks}</div>
                    <div className="text-xs text-muted-foreground">Livros</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile._count.reviews}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile._count.followers}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile._count.following}</div>
                    <div className="text-xs text-muted-foreground">Seguindo</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <ProfileStats reviewCount={profile._count.reviews} />

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onSuccess={refetch}
        />
      </div>
    </Layout>
  );
}