"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/card";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { User } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
}

interface FollowersResponse {
  data: UserItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FollowersListProps {
  userId: string;
  type: "followers" | "following";
}

export function FollowersList({ userId, type }: FollowersListProps) {
  const {
    data: usersData,
    isLoading,
    error,
  } = useGet<FollowersResponse>(
    ["user", userId, type],
    `/api/user/${userId}/${type}?page=1&limit=50`,
    !!userId
  );

  const users = usersData?.data?.data || [];

  if (isLoading) {
    return <Loading text={`Carregando ${type === "followers" ? "seguidores" : "seguindo"}...`} />;
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Erro ao carregar {type === "followers" ? "seguidores" : "seguindo"}.
        </p>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum {type === "followers" ? "seguidor" : "usuário seguido"} ainda.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Link key={user.id} href={`/user/${user.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4 flex gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{user.name}</h3>
                {user.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {user.bio}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}