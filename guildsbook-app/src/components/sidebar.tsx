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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Início",
    href: "/",
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
  
    return (
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background",
          className
        )}
      >
      <div className="flex flex-col h-full">
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
  );
}