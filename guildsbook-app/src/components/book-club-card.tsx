"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/card";
import { Button } from "@/components/button";
import { Users, Lock, Globe, MessageSquare } from "lucide-react";
import { useMutationApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";

interface BookClub {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  maxMembers?: number | null;
  currentMembers?: number;
  memberCount?: number;
  discussionCount?: number;
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  isMember?: boolean;
  userRole?: string | null;
}

interface BookClubCardProps {
  club: BookClub;
  onUpdate?: () => void;
}

export function BookClubCard({ club, onUpdate }: BookClubCardProps) {
  const router = useRouter();
  const joinMutation = useMutationApi(
    ["clubs"],
    `/api/clubs/${club.id}/join`,
    "POST"
  );

  const handleJoin = async () => {
    try {
      await joinMutation.mutateAsync({});
      onUpdate?.();
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Erro ao entrar no clube");
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2">{club.name}</CardTitle>
            {club.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {club.description}
              </CardDescription>
            )}
          </div>
          <span title={club.isPublic ? "Público" : "Privado"}>
            {club.isPublic ? (
              <Globe className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {club.memberCount || club.currentMembers || 0}
                {club.maxMembers && ` / ${club.maxMembers}`} membros
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{club.discussionCount || 0} discussões</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Criado por {club.owner.name}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/clubs/${club.id}`}>Ver Detalhes</Link>
          </Button>
          {!club.isMember && club.isPublic && (
            <Button
              variant="default"
              size="sm"
              onClick={handleJoin}
              disabled={joinMutation.isPending}
            >
              {joinMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          )}
          {club.isMember && (
            <Button variant="outline" size="sm" disabled>
              Membro
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
