"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogOut, Menu, LogIn, User as UserIcon, Settings } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const { toggle } = useSidebar();
  const [mounted, setMounted] = useState(false);
  
  // Evitar hidratação mismatch - só renderizar conteúdo dinâmico após montagem
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isLandingPage = pathname === "/";

  const userAvatar = user?.image;
  const userName = user?.name || user?.email?.split("@")[0] || "U";
  const initials = (userName || "U")
    .split(" ")
    .map((n) => n && n.length > 0 ? n[0] : "")
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  
  // Durante SSR e carregamento inicial, renderizar versão estática
  // Só renderizar conteúdo que depende de autenticação após hidratação completa
  const isClientReady = mounted;
  const showAuthButton = isClientReady && !isLoading && isAuthenticated;
  const showLoginButton = isClientReady && !isLoading && !isAuthenticated;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-6">
          {/* Botão hambúrguer - sempre renderizar espaço para evitar layout shift */}
          <div className={cn(
            "w-10 h-10 flex items-center justify-center",
            (!isClientReady || isLoading || isLandingPage || !isAuthenticated) && "invisible"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className={cn(
                !isClientReady && "pointer-events-none opacity-0"
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="GuildsBook" 
              width={150} 
              height={80} 
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>
          {!isLandingPage && (
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/books"
                className="text-sm font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200"
              >
                Livros
              </Link>
              <Link
                href="/feed"
                className="text-sm font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200"
              >
                Feed
              </Link>
              <Link
                href="/clubs"
                className="text-sm font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all duration-200"
              >
                Clubes
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {showAuthButton ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200 hover:scale-105">
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl">
                {/* Informações do Usuário */}
                <DropdownMenuLabel className="px-3 py-2.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground leading-none truncate">
                      {userName}
                    </p>
                    {user?.email && (
                      <p className="text-xs text-muted-foreground truncate leading-none">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Menu Items */}
                <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                  <Link href="/profile" className="flex items-center gap-3 w-full">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="px-3 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                  <Link href="/settings" className="flex items-center gap-3 w-full">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Configurações</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Logout */}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  variant="destructive"
                  className="px-3 py-2.5 cursor-pointer hover:bg-destructive/10 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : showLoginButton ? (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-[#c39738] to-[#7f4311] hover:from-[#b08732] hover:to-[#6f3a0f] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200" 
              asChild
            >
              <Link href="/auth/signin" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            </Button>
          ) : (
            // Placeholder durante carregamento - mesmo tamanho do botão/login para evitar layout shift
            <div className="h-8 w-[73px]" />
          )}
        </div>
      </div>
    </header>
  );
}