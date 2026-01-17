import { Layout } from "@/components/layout";
import { Shield, Lock, Eye, Database } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade - GuildsBook",
  description: "Conheça como o GuildsBook coleta, usa e protege suas informações pessoais.",
};

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              O GuildsBook respeita sua privacidade e está comprometido em proteger suas informações 
              pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos 
              e protegemos suas informações quando você usa nossa plataforma.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">2. Informações que Coletamos</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.1. Informações Fornecidas por Você</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Nome, email e informações de perfil</li>
                  <li>Conteúdo que você publica (resenhas, citações, comentários)</li>
                  <li>Livros em sua biblioteca e listas de leitura</li>
                  <li>Preferências de conta e configurações</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.2. Informações Coletadas Automaticamente</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Dados de uso da plataforma (páginas visitadas, tempo de uso)</li>
                  <li>Informações do dispositivo (tipo, navegador, sistema operacional)</li>
                  <li>Endereço IP e dados de localização aproximada</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">3. Como Usamos Suas Informações</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Usamos suas informações para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Comunicar-nos com você sobre sua conta e nossos serviços</li>
              <li>Enviar recomendações de livros baseadas em suas preferências</li>
              <li>Garantir a segurança e prevenir fraudes</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">4. Compartilhamento de Informações</h2>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Com seu consentimento:</strong> Quando você autoriza explicitamente o compartilhamento</li>
                <li><strong>Prestadores de serviços:</strong> Com empresas que nos ajudam a operar a plataforma</li>
                <li><strong>Conteúdo público:</strong> Informações que você escolhe tornar públicas (como resenhas e perfil)</li>
                <li><strong>Requisitos legais:</strong> Quando exigido por lei ou processo legal</li>
                <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos e segurança</li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Segurança dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
              suas informações contra acesso não autorizado, alteração, divulgação ou destruição. 
              Isso inclui criptografia, controle de acesso e monitoramento regular de segurança.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Usamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Manter sua sessão ativa</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar como você usa a plataforma</li>
              <li>Personalizar conteúdo e anúncios</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Você pode controlar cookies através das configurações do seu navegador, mas isso pode 
              afetar a funcionalidade da plataforma.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Seus Direitos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Você tem os seguintes direitos em relação às suas informações pessoais:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Acesso:</strong> Solicitar uma cópia das informações que temos sobre você</li>
              <li><strong>Retificação:</strong> Corrigir informações imprecisas ou incompletas</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações</li>
              <li><strong>Portabilidade:</strong> Receber suas informações em formato estruturado</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de suas informações</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Para exercer esses direitos, entre em contato conosco através da nossa página de 
              <a href="/contact" className="text-primary hover:underline"> Contato</a>.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as 
              finalidades descritas nesta política, a menos que um período de retenção mais longo 
              seja exigido ou permitido por lei.
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
              sobre mudanças significativas publicando a nova política nesta página e atualizando 
              a data de "última atualização".
            </p>
          </section>

          <section className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco 
              através da nossa página de <a href="/contact" className="text-primary hover:underline">Contato</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
