"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
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
  const { user, isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();
  const { toggle } = useSidebar();
  
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

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffff96]/90 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-[#ffff96]/70 dark:supports-[backdrop-filter]:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-6">
          {isAuthenticated && !isLandingPage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
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
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/books"
                className="text-sm font-medium text-[#5e4318] dark:text-muted-foreground transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
              >
                Livros
              </Link>
              <Link
                href="/feed"
                className="text-sm font-medium text-[#5e4318] dark:text-muted-foreground transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
              >
                Feed
              </Link>
              <Link
                href="/clubs"
                className="text-sm font-medium text-[#5e4318] dark:text-muted-foreground transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
              >
                Clubes
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
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
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
}