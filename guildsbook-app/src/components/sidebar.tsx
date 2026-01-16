"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Star,
  Users,
  Bookmark,
  Library,
  User,
  Settings,
  BarChart3,
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
    title: "Meus Livros",
    href: "/my-books",
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
    title: "Biblioteca",
    href: "/library",
    icon: Library,
  },
  {
    title: "Estatísticas",
    href: "/stats",
    icon: BarChart3,
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
          "fixed lg:static inset-y-0 left-0 z-50 lg:z-auto",
          "flex flex-col w-64 lg:w-56 border-r bg-background",
          "transition-transform duration-300 ease-in-out",
          !isOpen && "-translate-x-full lg:translate-x-0 lg:block",
          className
        )}
      >
      <div className="flex flex-col h-full">
        {/* Botão de fechar para mobile */}
        <div className="flex items-center justify-between border-b p-4 lg:hidden">
          <span className="text-lg font-bold">Menu</span>
          <Button variant="ghost" size="sm" onClick={close}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t px-4 py-4">
          <nav className="space-y-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
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