import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";

interface ErrorProps {
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function Error({
  title = "Algo deu errado",
  message = "Ocorreu um erro inesperado. Por favor, tente novamente.",
  className,
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}