import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/button";
import { MobileMenu } from "@/components/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-6">
          <MobileMenu />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">GuildsBook</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/books"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Livros
            </Link>
            <Link
              href="/feed"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Feed
            </Link>
            <Link
              href="/clubs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clubes
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/signin">Entrar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}