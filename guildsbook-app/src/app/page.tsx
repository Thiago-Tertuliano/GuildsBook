"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { Button } from "@/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { useAuth } from "@/hooks/use-auth";
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
  UserPlus,
  BookPlus,
  Network,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Se estiver carregando ou autenticado, mostra loading (redirecionamento em andamento)
  if (isLoading || isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center gap-6 px-4 py-20 text-center overflow-hidden">
          {/* Vídeo de fundo */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/landing-page.mp4" type="video/mp4" />
          </video>
          {/* Overlay escuro para destacar o texto */}
          <div className="absolute inset-0 bg-black/85 z-[1]"></div>
          
          <div className="relative z-10 container mx-auto flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Bem-vindo ao{" "}
              <span className="bg-gradient-to-r from-[#c39738] via-[#7f4311] to-[#5e4318] bg-clip-text text-transparent">
                GuildsBook
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/90 sm:text-xl">
              Sua plataforma social para descobrir livros, compartilhar avaliações
              e conectar-se com outros leitores apaixonados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button size="lg" className="bg-gradient-to-r from-[#c39738] to-[#7f4311] hover:from-[#b08732] hover:to-[#6f3a0f] text-white shadow-lg shadow-[#c39738]/50" asChild>
                <Link href="/auth/signin">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-[#c39738] text-[#7f4311] hover:bg-[#ffff96]/30 dark:border-[#c39738] dark:text-[#c39738] dark:hover:bg-[#5e4318]/20" asChild>
                <Link href="/books">Explorar Livros</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative w-full bg-gradient-to-b from-[#ffff96]/10 via-[#ffff96]/8 to-[#7f4311]/8 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#c39738] to-[#7f4311] bg-clip-text text-transparent">
                Por que escolher o GuildsBook?
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                Tudo que você precisa para organizar sua leitura e se conectar com outros leitores
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-[#c39738] dark:hover:border-[#c39738] group">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#c39738] to-[#7f4311] text-white mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Biblioteca Pessoal</CardTitle>
                  <CardDescription className="text-base">
                    Organize seus livros e acompanhe seu progresso de leitura
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-[#5e4318] dark:hover:border-[#5e4318] group">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#7f4311] to-[#5e4318] text-white mb-4 group-hover:scale-110 transition-transform">
                    <Star className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Avaliações</CardTitle>
                  <CardDescription className="text-base">
                    Compartilhe suas opiniões e descubra novos títulos
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-[#ffff96] dark:hover:border-[#ffff96]/50 group">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#ffff96] to-[#c39738] text-[#361f00] mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Clubes de Leitura</CardTitle>
                  <CardDescription className="text-base">
                    Participe de discussões e conecte-se com outros leitores
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-[#7f4311] dark:hover:border-[#7f4311] group">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#c39738] to-[#5e4318] text-white mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Descobrir</CardTitle>
                  <CardDescription className="text-base">
                    Encontre os livros mais populares e tendências
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative w-full bg-gradient-to-b from-[#7f4311]/8 via-[#7f4311]/10 to-[#5e4318]/8 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#c39738] to-[#5e4318] bg-clip-text text-transparent">
                Como Funciona
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                Em poucos passos, você começa a organizar sua leitura e se conectar com a comunidade
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#c39738] to-[#7f4311] text-white mb-4 shadow-lg shadow-[#c39738]/50 group-hover:scale-110 transition-transform">
                  <UserPlus className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Crie sua conta</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Cadastre-se gratuitamente e comece a organizar sua biblioteca pessoal
                </p>
              </div>
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#ffff96] to-[#c39738] text-[#361f00] mb-4 shadow-lg shadow-[#ffff96]/50 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8" />
                  <div className="absolute -top-1 -right-1 bg-gradient-to-br from-[#7f4311] to-[#5e4318] text-white rounded-full p-1">
                    <BookPlus className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Adicione livros</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Busque e adicione livros à sua biblioteca, acompanhe seu progresso
                </p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#7f4311] to-[#5e4318] text-white mb-4 shadow-lg shadow-[#7f4311]/50 group-hover:scale-110 transition-transform">
                  <Network className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Conecte-se</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Compartilhe reviews, participe de clubes e descubra novos leitores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="relative w-full bg-gradient-to-b from-[#5e4318]/8 via-[#5e4318]/10 to-[#361f00]/8 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#c39738] to-[#5e4318] bg-clip-text text-transparent">
                Recursos Principais
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="flex gap-4 p-4 rounded-lg hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c39738] to-[#7f4311] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Busca Avançada</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Filtre por gênero, ano, editora, idioma e muito mais
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ffff96] to-[#c39738] flex items-center justify-center text-[#361f00] group-hover:scale-110 transition-transform">
                    <Bookmark className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Listas de Leitura</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Crie e compartilhe listas personalizadas de livros
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7f4311] to-[#5e4318] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Citações</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Salve e compartilhe suas citações favoritas dos livros
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c39738] to-[#5e4318] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Estatísticas</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Acompanhe seu progresso com gráficos e métricas detalhadas
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ffff96] to-[#c39738] flex items-center justify-center text-[#361f00] group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Seguir Leitores</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Conecte-se com outros leitores e descubra recomendações
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-lg hover:bg-[#ffff96]/20 dark:hover:bg-[#5e4318]/20 transition-colors group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c39738] to-[#7f4311] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Star className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Avaliações</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Deixe reviews e comente nas avaliações de outros leitores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full bg-gradient-to-r from-[#c39738] via-[#7f4311] to-[#5e4318] text-white py-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Pronto para começar sua jornada literária?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95">
              Junte-se à nossa comunidade de leitores e descubra um mundo de livros
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-[#ffff96] text-[#361f00] hover:bg-[#ffff96]/90 shadow-xl" asChild>
                <Link href="/auth/signin">
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
                <Link href="/books">Explorar Livros</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
