import Link from "next/link";
import { Layout } from "@/components/layout";
import { Button } from "@/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { BookOpen, Star, Users, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="container flex flex-col items-center justify-center gap-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Bem-vindo ao{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              GuildsBook
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Sua plataforma social para descobrir livros, compartilhar avaliações
            e conectar-se com outros leitores apaixonados.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signin">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/books">Explorar Livros</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-20">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Por que escolher o GuildsBook?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <BookOpen className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Biblioteca Pessoal</CardTitle>
                <CardDescription>
                  Organize seus livros e acompanhe seu progresso de leitura
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>
                  Compartilhe suas opiniões e descubra novos títulos
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Clubes de Leitura</CardTitle>
                <CardDescription>
                  Participe de discussões e conecte-se com outros leitores
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Descobrir</CardTitle>
                <CardDescription>
                  Encontre os livros mais populares e tendências
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}