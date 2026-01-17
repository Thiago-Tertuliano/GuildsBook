import { Layout } from "@/components/layout";
import { FileText, Shield, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Termos de Uso - GuildsBook",
  description: "Leia os termos de uso do GuildsBook e entenda suas responsabilidades ao usar nossa plataforma.",
};

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Termos de Uso
            </h1>
          </div>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar o GuildsBook, você concorda em estar vinculado a estes Termos de Uso. 
              Se você não concorda com qualquer parte destes termos, não deve usar nossa plataforma.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">2. Uso da Plataforma</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.1. Elegibilidade</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Você deve ter pelo menos 13 anos de idade para usar o GuildsBook. Se você tiver 
                  menos de 18 anos, deve ter a permissão de um pai ou responsável.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.2. Conta de Usuário</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Você é responsável por manter a segurança de sua conta e senha. O GuildsBook não 
                  pode e não será responsável por qualquer perda ou dano resultante do seu fracasso 
                  em cumprir esta obrigação de segurança.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.3. Uso Apropriado</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Você concorda em não usar a plataforma para qualquer propósito ilegal ou não autorizado. 
                  Você não deve, no uso do serviço, violar quaisquer leis em sua jurisdição.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Conteúdo do Usuário</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Você mantém todos os direitos sobre o conteúdo que publica no GuildsBook, incluindo 
                resenhas, citações e comentários. Ao publicar conteúdo, você concede ao GuildsBook uma 
                licença não exclusiva, livre de royalties e mundial para usar, reproduzir e exibir 
                seu conteúdo na plataforma.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Você é responsável por garantir que todo o conteúdo que você publica não viole os 
                direitos de propriedade intelectual de terceiros.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">4. Conduta Proibida</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você concorda em não:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Publicar conteúdo difamatório, ofensivo, abusivo ou discriminatório</li>
              <li>Usar a plataforma para spam ou atividades comerciais não autorizadas</li>
              <li>Violar os direitos de privacidade de outros usuários</li>
              <li>Tentar acessar contas de outros usuários ou sistemas da plataforma</li>
              <li>Usar bots ou scripts automatizados para interagir com a plataforma</li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo da plataforma, incluindo design, logotipos, textos, gráficos e software, 
              é propriedade do GuildsBook ou de seus licenciadores e está protegido por leis de direitos 
              autorais e outras leis de propriedade intelectual.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O GuildsBook é fornecido "como está" sem garantias de qualquer tipo. Não garantimos que 
              a plataforma estará sempre disponível, segura ou livre de erros. Em nenhuma circunstância 
              seremos responsáveis por danos indiretos, incidentais ou consequenciais.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Modificações dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações 
              significativas serão notificadas aos usuários. O uso continuado da plataforma após 
              as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
              da nossa página de <a href="/contact" className="text-primary hover:underline">Contato</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
