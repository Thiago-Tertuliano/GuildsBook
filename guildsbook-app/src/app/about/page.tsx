import { Layout } from "@/components/layout";
import { BookOpen, Users, Heart, Target } from "lucide-react";

export const metadata = {
  title: "Sobre Nós - GuildsBook",
  description: "Conheça mais sobre o GuildsBook, uma plataforma social para leitores e amantes de livros.",
};

export default function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Sobre o GuildsBook
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conectando leitores e transformando a experiência de leitura
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Nossa Missão</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              O GuildsBook foi criado com a missão de unir leitores de todo o mundo em uma 
              comunidade vibrante e acolhedora. Acreditamos que a leitura é uma jornada compartilhada, 
              e queremos proporcionar um espaço onde você possa descobrir novos livros, compartilhar 
              suas experiências, e se conectar com pessoas que compartilham sua paixão pela literatura.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Paixão pela Leitura</h3>
              <p className="text-muted-foreground leading-relaxed">
                Acreditamos que cada livro tem o poder de transformar vidas e expandir horizontes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Comunidade</h3>
              <p className="text-muted-foreground leading-relaxed">
                Construímos uma comunidade inclusiva onde todos são bem-vindos e valorizados.
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
              <Heart className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Autenticidade</h3>
              <p className="text-muted-foreground leading-relaxed">
                Valorizamos opiniões honestas e discussões genuínas sobre literatura.
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40 hover:shadow-lg transition-shadow">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Descoberta</h3>
              <p className="text-muted-foreground leading-relaxed">
                Facilitamos a descoberta de novos livros e autores através de recomendações inteligentes.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            O que oferecemos
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40">
              <h3 className="text-xl font-semibold text-foreground mb-2">Biblioteca Pessoal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize seus livros, acompanhe seu progresso de leitura e defina metas pessoais.
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40">
              <h3 className="text-xl font-semibold text-foreground mb-2">Avaliações e Resenhas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Compartilhe suas opiniões sobre livros e descubra o que outros leitores estão pensando.
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40">
              <h3 className="text-xl font-semibold text-foreground mb-2">Clubes de Leitura</h3>
              <p className="text-muted-foreground leading-relaxed">
                Participe ou crie clubes de leitura para discutir livros com outros membros.
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40">
              <h3 className="text-xl font-semibold text-foreground mb-2">Listas de Leitura</h3>
              <p className="text-muted-foreground leading-relaxed">
                Crie listas personalizadas de livros que deseja ler ou compartilhe suas recomendações.
              </p>
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Junte-se à nossa comunidade
          </h2>
          <p className="text-primary-foreground/90 mb-6 text-lg max-w-2xl mx-auto">
            Comece sua jornada literária hoje e descubra um mundo de possibilidades
          </p>
        </section>
      </div>
    </Layout>
  );
}
