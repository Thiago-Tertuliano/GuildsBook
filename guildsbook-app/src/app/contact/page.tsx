"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Mail, MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula envio do formulário (aqui você integraria com sua API de email)
    try {
      // TODO: Integrar com API de email (SendGrid, Resend, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Entre em Contato
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou feedback? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
              </div>
              <p className="text-muted-foreground">
                contato@guildsbook.com
              </p>
            </div>

            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-xl p-6 shadow-md border border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Tempo de Resposta</h3>
              </div>
              <p className="text-muted-foreground">
                Respondemos em até 48 horas úteis
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Outras formas de contato
              </h3>
              <p className="text-sm text-muted-foreground">
                Para questões urgentes ou relacionadas à sua conta, você também pode 
                usar o sistema de suporte dentro da plataforma.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl p-8 shadow-lg border border-border/40">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Mensagem Enviada!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Obrigado pelo seu contato. Responderemos em breve.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                  >
                    Enviar Outra Mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Nome *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Assunto *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Qual é o assunto da sua mensagem?"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={8}
                      placeholder="Descreva sua dúvida, sugestão ou feedback..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
