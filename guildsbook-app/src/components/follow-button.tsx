"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { useGet, useMutationApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  onFollowChange?: () => void;
}

interface FollowStatusResponse {
  isFollowing: boolean;
}

export function FollowButton({ userId, onFollowChange }: FollowButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: followStatus } = useGet<FollowStatusResponse>(
    ["user", userId, "follow-status"],
    isAuthenticated ? `/api/user/${userId}/follow` : "",
    isAuthenticated && !!userId && user?.id !== userId
  );

  const followMutation = useMutationApi(
    ["user", userId, "follow"],
    `/api/user/${userId}/follow`,
    "POST"
  );

  const unfollowMutation = useMutationApi(
    ["user", userId, "follow"],
    `/api/user/${userId}/follow`,
    "DELETE"
  );

  useEffect(() => {
    if (followStatus?.data) {
      setIsFollowing(followStatus.data.isFollowing);
      setIsLoading(false);
    }
  }, [followStatus]);

  // Não mostrar se não estiver autenticado ou se for o próprio perfil
  if (!isAuthenticated || user?.id === userId) {
    return null;
  }

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(undefined as any, {
          mutationFn: async () => {
            const response = await fetch(`/api/user/${userId}/follow`, {
              method: "DELETE",
            });
            if (!response.ok) {
              throw new Error("Erro ao deixar de seguir");
            }
            return response.json();
          },
        } as any);
        setIsFollowing(false);
      } else {
        await followMutation.mutateAsync(undefined as any, {
          mutationFn: async () => {
            const response = await fetch(`/api/user/${userId}/follow`, {
              method: "POST",
            });
            if (!response.ok) {
              throw new Error("Erro ao seguir");
            }
            return response.json();
          },
        } as any);
        setIsFollowing(true);
      }
      onFollowChange?.();
    } catch (error) {
      console.error("Erro ao alterar follow:", error);
    }
  };

  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleToggleFollow}
      disabled={isLoading || isMutating}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Seguindo
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Seguir
        </>
      )}
    </Button>
  );
}