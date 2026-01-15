"use client";

import { useState } from "react";
import { Layout } from "@/components/layout";
import { useGet } from "@/hooks/use-api";
import { Loading } from "@/components/loading";
import { Error as ErrorComponent } from "@/components/error";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { BookStatus } from "@/types";
import { UserBookList } from "@/components/user-book-list";
import { AddBookModal } from "@/components/add-book-modal";
import { UpdateBookStatusModal } from "@/components/update-book-status-modal";
import { Plus } from "lucide-react";

interface UserBook {
  id: string;
  status: BookStatus;
  rating?: number | null;
  review?: string | null;
  readDate?: Date | null;
  currentPage?: number | null;
  createdAt: Date;
  book: {
    id: string;
    title: string;
    author: string;
    cover?: string | null;
    isbn?: string | null;
    genre?: string | null;
    publishedYear?: number | null;
    pages?: number | null;
  };
}

interface UserBooksResponse {
  data: UserBook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function LibraryPage() {
  const [statusFilter, setStatusFilter] = useState<BookStatus | "">("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<UserBook | null>(null);

  const {
    data: userBooksData,
    isLoading,
    error,
    refetch,
  } = useGet<UserBooksResponse>(
    ["user", "books", statusFilter || "all"],
    `/api/user/books${statusFilter ? `?status=${statusFilter}&page=1&limit=100` : "?page=1&limit=100"}`
  );

  const userBooks = userBooksData?.data?.data || [];

  return (
    <Layout withSidebar>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Livro
          </Button>
        </div>

        {/* Filtros por Status - Responsivos */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("")}
            className="flex-1 sm:flex-none"
          >
            Todos
          </Button>
          <Button
            variant={statusFilter === "QUERO_LER" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("QUERO_LER")}
            className="flex-1 sm:flex-none"
          >
            Quero Ler
          </Button>
          <Button
            variant={statusFilter === "LENDO" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("LENDO")}
            className="flex-1 sm:flex-none"
          >
            Lendo
          </Button>
          <Button
            variant={statusFilter === "LIDO" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("LIDO")}
            className="flex-1 sm:flex-none"
          >
            Lido
          </Button>
        </div>

        {isLoading && <Loading text="Carregando biblioteca..." />}

        {error && (
          <ErrorComponent
            message="Erro ao carregar sua biblioteca"
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (
          <>
            {userBooks.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {statusFilter
                    ? "Nenhum livro encontrado com este status."
                    : "Sua biblioteca está vazia. Adicione seu primeiro livro!"}
                </p>
              </Card>
            ) : (
              <UserBookList
                books={userBooks}
                onEdit={(book) => setEditingBook(book)}
                onUpdate={refetch}
              />
            )}
          </>
        )}

        <AddBookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refetch();
          }}
        />

        {editingBook && (
          <UpdateBookStatusModal
            isOpen={!!editingBook}
            onClose={() => setEditingBook(null)}
            book={editingBook}
            onSuccess={() => {
              setEditingBook(null);
              refetch();
            }}
          />
        )}
      </div>
    </Layout>
  );
}