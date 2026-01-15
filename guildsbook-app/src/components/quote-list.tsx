"use client";

import { useState } from "react";
import { QuoteCard } from "@/components/quote-card";
import { Card } from "@/components/card";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { useAuth } from "@/hooks/use-auth";
import { EditQuoteModal } from "@/components/edit-quote-modal";

interface Quote {
  id: string;
  content: string;
  page?: number | null;
  chapter?: string | null;
  isPublic: boolean;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  book: {
    id: string;
    title: string;
    author: string;
    cover?: string | null;
  };
}

interface QuotesResponse {
  data: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface QuoteListProps {
  bookId: string;
}

export function QuoteList({ bookId }: QuoteListProps) {
  const { user } = useAuth();
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const {
    data: quotesData,
    isLoading,
    error,
    refetch,
  } = useGet<QuotesResponse>(
    ["books", bookId, "quotes"],
    `/api/books/${bookId}/quotes?page=1&limit=20`
  );

  const quotes = quotesData?.data?.data || [];

  const handleDelete = async (quoteId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta citação?")) {
      return;
    }

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar citação");
      }
      refetch();
    } catch (error) {
      console.error("Erro ao deletar citação:", error);
      alert("Erro ao deletar citação. Tente novamente.");
    }
  };

  const handleLike = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Erro ao curtir citação");
      }
      refetch();
    } catch (error) {
      console.error("Erro ao curtir citação:", error);
      alert("Erro ao curtir citação. Tente novamente.");
    }
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return <Loading text="Carregando citações..." />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Erro ao carregar citações"
        onRetry={refetch}
      />
    );
  }

  if (quotes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Ainda não há citações para este livro. Seja o primeiro a compartilhar uma citação!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        ))}
      </div>

      {editingQuote && (
        <EditQuoteModal
          isOpen={!!editingQuote}
          onClose={() => setEditingQuote(null)}
          quote={editingQuote}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}