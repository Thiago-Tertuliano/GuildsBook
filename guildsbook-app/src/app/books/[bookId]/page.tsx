"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { ArrowLeft, BookOpen, Calendar, Hash, Users, Star, Quote as QuoteIcon, Plus } from "lucide-react";
import { useState } from "react";
import { QuoteList } from "@/components/quote-list";
import { AddQuoteModal } from "@/components/add-quote-modal";
import { useAuth } from "@/hooks/use-auth";

interface BookDetails {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
  isbn?: string | null;
  genre?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
  description?: string | null;
  _count?: {
    reviews: number;
    userBooks: number;
  };
}

export default function BookDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const bookId = params.bookId as string;
  const [activeTab, setActiveTab] = useState<"details" | "quotes">("details");
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false);

  const {
    data: bookData,
    isLoading,
    error,
    refetch,
  } = useGet<BookDetails>(["book", bookId], `/api/books/${bookId}`, !!bookId);

  const book = bookData?.data as BookDetails | undefined;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Loading text="Carregando detalhes do livro..." />
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <ErrorComponent
            title="Livro não encontrado"
            message="Não foi possível carregar os detalhes do livro."
            onRetry={refetch}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Link href="/books">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para busca
          </Button>
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Capa do livro */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="relative w-full aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do livro */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{book.title}</CardTitle>
                <p className="text-lg text-muted-foreground">{book.author}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metadados */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {book.publishedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ano:</span>
                      <span>{book.publishedYear}</span>
                    </div>
                  )}
                  {book.pages && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Páginas:</span>
                      <span>{book.pages}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">ISBN:</span>
                      <span className="font-mono text-xs">{book.isbn}</span>
                    </div>
                  )}
                  {book.genre && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Gênero:</span>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {book.genre}
                      </span>
                    </div>
                  )}
                </div>

                {/* Estatísticas */}
                {book._count && (
                  <div className="flex gap-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {book._count.userBooks} leitores
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {book._count.reviews} avaliações
                      </span>
                    </div>
                  </div>
                )}

                {/* Descrição */}
                {book.description && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Sinopse</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex gap-4">
              <Button asChild>
                <Link href={`/books/${bookId}/reviews`}>
                  Ver Avaliações
                </Link>
              </Button>
              <Button variant="outline" asChild>
              <Link href={`/library?add=${bookId}`}>
                  Adicionar à Biblioteca
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Abas de conteúdo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "details" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("details")}
                >
                  Detalhes
                </Button>
                <Button
                  variant={activeTab === "quotes" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("quotes")}
                >
                  <QuoteIcon className="h-4 w-4 mr-2" />
                  Citações
                </Button>
              </div>
              {activeTab === "quotes" && user && (
                <Button
                  size="sm"
                  onClick={() => setIsAddQuoteModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Citação
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "details" && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Veja as informações completas do livro acima.
                </p>
              </div>
            )}
            {activeTab === "quotes" && (
              <QuoteList bookId={bookId} />
            )}
          </CardContent>
        </Card>

        {/* Modal de adicionar citação */}
        {user && (
          <AddQuoteModal
            isOpen={isAddQuoteModalOpen}
            onClose={() => setIsAddQuoteModalOpen(false)}
            bookId={bookId}
            onSuccess={() => {
              setIsAddQuoteModalOpen(false);
              // O QuoteList vai atualizar automaticamente via React Query
            }}
          />
        )}
      </div>
    </Layout>
  );
}