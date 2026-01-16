import Link from "next/link";
import { Layout } from "@/components/layout";
import { Button } from "@/components/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-6 py-20 text-center">
        <FileQuestion className="h-24 w-24 text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Página não encontrada</h2>
          <p className="max-w-md text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/books">Explorar livros</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}