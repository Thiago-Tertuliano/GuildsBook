import Link from "next/link";
import { Layout } from "@/components/layout";
import { Button } from "@/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import {
  BookOpen,
  Star,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Search,
  Bookmark,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Bem-vindo ao{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              GuildsBook
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
            Sua plataforma social para descobrir livros, compartilhar avaliações
            e conectar-se com outros leitores apaixonados.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Button size="lg" asChild>
              <Link href="/auth/signin">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/books">Explorar Livros</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o GuildsBook?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para organizar sua leitura e se conectar com outros leitores
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Biblioteca Pessoal</CardTitle>
                <CardDescription>
                  Organize seus livros e acompanhe seu progresso de leitura
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>
                  Compartilhe suas opiniões e descubra novos títulos
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Clubes de Leitura</CardTitle>
                <CardDescription>
                  Participe de discussões e conecte-se com outros leitores
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Descobrir</CardTitle>
                <CardDescription>
                  Encontre os livros mais populares e tendências
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Como Funciona
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Em poucos passos, você começa a organizar sua leitura e se conectar com a comunidade
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Crie sua conta</h3>
                <p className="text-muted-foreground">
                  Cadastre-se gratuitamente e comece a organizar sua biblioteca pessoal
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Adicione livros</h3>
                <p className="text-muted-foreground">
                  Busque e adicione livros à sua biblioteca, acompanhe seu progresso
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Conecte-se</h3>
                <p className="text-muted-foreground">
                  Compartilhe reviews, participe de clubes e descubra novos leitores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Principais
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Search className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Busca Avançada</h3>
                <p className="text-muted-foreground">
                  Filtre por gênero, ano, editora, idioma e muito mais
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Bookmark className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Listas de Leitura</h3>
                <p className="text-muted-foreground">
                  Crie e compartilhe listas personalizadas de livros
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Citações</h3>
                <p className="text-muted-foreground">
                  Salve e compartilhe suas citações favoritas dos livros
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Estatísticas</h3>
                <p className="text-muted-foreground">
                  Acompanhe seu progresso com gráficos e métricas detalhadas
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Seguir Leitores</h3>
                <p className="text-muted-foreground">
                  Conecte-se com outros leitores e descubra recomendações
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-primary mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Avaliações</h3>
                <p className="text-muted-foreground">
                  Deixe reviews e comente nas avaliações de outros leitores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para começar sua jornada literária?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se à nossa comunidade de leitores e descubra um mundo de livros
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signin">
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/books">Explorar Livros</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}