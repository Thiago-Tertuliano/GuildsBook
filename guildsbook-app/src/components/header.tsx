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
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogOut, Menu, LogIn } from "lucide-react";

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
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
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