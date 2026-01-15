"use client";

import { useParams } from "next/navigation";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card, CardContent } from "@/components/card";
import { MapPin, Calendar, BookOpen, Star, Users } from "lucide-react";
import Image from "next/image";

interface PublicUserProfile {
  id: string;
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

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGet<PublicUserProfile>(
    ["user", userId],
    `/api/user/${userId}`,
    !!userId
  );

  const profile = profileData?.data;

  if (isLoading) {
    return (
      <Layout withSidebar>
        <div className="container py-6">
          <Loading text="Carregando perfil..." />
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout withSidebar>
        <div className="container py-6">
          <ErrorComponent
            message="Erro ao carregar perfil do usuário"
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
      <div className="container py-6 space-y-6">
        {/* Header do Perfil */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl md:text-4xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  {profile.bio && (
                    <p className="text-muted-foreground mt-2">{profile.bio}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {joinedDate}</span>
                  </div>
                </div>

                <div className="flex gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{profile._count.userBooks}</div>
                      <div className="text-xs text-muted-foreground">Livros</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{profile._count.reviews}</div>
                      <div className="text-xs text-muted-foreground">Reviews</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{profile._count.followers}</div>
                      <div className="text-xs text-muted-foreground">Seguidores</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-2xl font-bold">{profile._count.following}</div>
                      <div className="text-xs text-muted-foreground">Seguindo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}