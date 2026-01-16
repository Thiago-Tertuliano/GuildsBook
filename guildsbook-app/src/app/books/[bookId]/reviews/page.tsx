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
import { ArrowLeft, Star, User, MessageSquare, Calendar } from "lucide-react";
import { ActivityItem } from "@/components/activity-item";

interface Review {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  _count: {
    comments: number;
  };
}

interface BookDetails {
  id: string;
  title: string;
  author: string;
  cover?: string | null;
}

interface ReviewsResponse {
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function BookReviewsPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const {
    data: bookData,
    isLoading: isLoadingBook,
    error: bookError,
    refetch: refetchBook,
  } = useGet<BookDetails>(["book", bookId], `/api/books/${bookId}`, !!bookId);

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
    refetch: refetchReviews,
  } = useGet<ReviewsResponse>(
    ["book", bookId, "reviews"],
    `/api/books/${bookId}/reviews?page=1&limit=100`,
    !!bookId
  );

  const book = bookData?.data as BookDetails | undefined;
  const reviews = reviewsData?.data?.data || [];

  const handleLike = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Erro ao curtir review");
      }
      refetchReviews();
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  };

  if (isLoadingBook || isLoadingReviews) {
    return (
      <Layout withSidebar>
        <div className="container mx-auto px-4 py-6">
          <Loading text="Carregando avaliações do livro..." />
        </div>
      </Layout>
    );
  }

  if (bookError || !book) {
    return (
      <Layout withSidebar>
        <div className="container mx-auto px-4 py-6">
          <ErrorComponent
            title="Livro não encontrado"
            message="Não foi possível carregar os detalhes do livro."
            onRetry={refetchBook}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout withSidebar>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Link href={`/books/${bookId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o livro
          </Button>
        </Link>

        {/* Cabeçalho do livro */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="relative w-24 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{book.author}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>{reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de reviews */}
        {reviewsError ? (
          <ErrorComponent
            title="Erro ao carregar avaliações"
            message="Não foi possível carregar as avaliações do livro."
            onRetry={refetchReviews}
          />
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Este livro ainda não possui avaliações. Seja o primeiro a avaliar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ActivityItem
                key={review.id}
                activity={{
                  id: review.id,
                  type: "review",
                  user: review.user,
                  book: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    cover: book.cover,
                  },
                  content: review.content,
                  rating: review.rating,
                  likes: 0, // TODO: adicionar contagem de likes quando implementado
                  commentsCount: review._count.comments,
                  createdAt: review.createdAt,
                }}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}