"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Star,
  Users,
  Bookmark,
  User,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";

const navItems = [
  {
    title: "Início",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Biblioteca",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Avaliações",
    href: "/reviews",
    icon: Star,
  },
  {
    title: "Listas de Leitura",
    href: "/reading-lists",
    icon: Bookmark,
  },
  {
    title: "Clubes",
    href: "/clubs",
    icon: Users,
  },
];

const bottomNavItems = [
  {
    title: "Perfil",
    href: "/profile",
    icon: User,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={close}
        />
      )}
      
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40",
          "flex flex-col w-64 border-r border-border/40",
          "bg-gradient-to-b from-card via-card to-card/95 backdrop-blur-sm",
          "transition-transform duration-300 ease-in-out shadow-lg",
          !isOpen && "-translate-x-full lg:translate-x-0 lg:block",
          className
        )}
      >
      <div className="flex flex-col h-full">
        {/* Botão de fechar para mobile */}
        <div className="flex items-center justify-between border-b border-border/40 p-4 lg:hidden bg-gradient-to-r from-primary/5 to-accent/5 flex-shrink-0">
          <span className="text-lg font-bold text-foreground">Menu</span>
          <Button variant="ghost" size="sm" onClick={close} className="hover:bg-accent/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 px-3 py-6">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                    "transition-all duration-200 ease-out relative group",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 via-primary/15 to-accent/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-gradient-to-r hover:from-accent/10 hover:via-accent/5 hover:to-transparent hover:text-foreground hover:border hover:border-accent/20"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-primary scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="relative">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary/60" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border/40 px-3 py-4 bg-gradient-to-t from-muted/30 to-transparent flex-shrink-0">
          <nav className="space-y-1.5">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                    "transition-all duration-200 ease-out relative group",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 via-primary/15 to-accent/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-gradient-to-r hover:from-accent/10 hover:via-accent/5 hover:to-transparent hover:text-foreground hover:border hover:border-accent/20"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-primary scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="relative">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary/60" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
    </>
  );
}