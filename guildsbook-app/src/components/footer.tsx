import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-[#ffff96]/90 dark:bg-black/95 border-[#c39738]/20 dark:border-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-10 md:h-24 md:flex-row md:py-0 max-w-7xl">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-[#5e4318] dark:text-muted-foreground md:text-left">
            © {new Date().getFullYear()} GuildsBook. Todos os direitos
            reservados.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-[#5e4318] dark:text-muted-foreground">
          <Link
            href="/about"
            className="transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
          >
            Sobre
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
          >
            Termos
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
          >
            Privacidade
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-[#7f4311] dark:hover:text-foreground"
          >
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
}