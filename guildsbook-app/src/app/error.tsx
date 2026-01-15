"use client";

import { useEffect } from "react";
import { Layout } from "@/components/layout";
import { Error as ErrorComponent } from "@/components/error";
import { Button } from "@/components/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Layout>
      <div className="container py-20">
        <ErrorComponent
          title="Algo deu errado"
          message={
            error.message ||
            "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
          }
          onRetry={reset}
          retryLabel="Tentar novamente"
        />
      </div>
    </Layout>
  );
}