import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Tipo base para respostas da API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Hook genérico para GET
export function useGet<T>(key: string[], url: string, enabled = true) {
  const query = useQuery<ApiResponse<T>>({
    queryKey: key,
    queryFn: async () => {
      if (!url) {
        throw new Error("URL is required");
      }
      const response = await fetch(url);
      if (!response.ok) {
        // Tentar ler o JSON de erro, mas tratar caso esteja vazio ou inválido
        let errorMessage = "Failed to fetch";
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const text = await response.text();
            if (text) {
              const error = JSON.parse(text);
              errorMessage = error.message || errorMessage;
            }
          } catch (e) {
            errorMessage = response.statusText || errorMessage;
          }
        } else {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          return JSON.parse(text);
        }
      }
      
      return { success: true, data: null };
    },
    enabled: enabled && !!url,
  });

  return {
    ...query,
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// Hook genérico para POST/PUT/DELETE
export function useMutationApi<T, V = unknown>(
  key: string[],
  url: string,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<T>, Error, V>({
    mutationFn: async (data: V) => {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Ler o texto da resposta uma única vez
        const contentType = response.headers.get("content-type");
        let responseText = "";
        
        try {
          responseText = await response.text();
        } catch (e) {
          // Se falhar ao ler, usar mensagem padrão
          const defaultMessage = response.statusText || "Failed to perform action";
          if (!response.ok) {
            throw new Error(defaultMessage);
          }
          return { success: true, data: null };
        }

      if (!response.ok) {
        // Tentar fazer parse do JSON de erro
        let errorMessage: string = response.statusText || `Request failed with status ${response.status}`;
        
        if (!errorMessage || errorMessage.trim() === "") {
          errorMessage = `Request failed with status ${response.status}`;
        }
        
        if (contentType && contentType.includes("application/json") && responseText && responseText.trim()) {
          try {
            const error = JSON.parse(responseText);
            // Tentar extrair mensagem de erro de várias formas
            const parsedMessage = error.message || error.error || error.error?.message || null;
            
            // Se houver detalhes de validação, formatar a mensagem
            if (error.details && Array.isArray(error.details) && error.details.length > 0) {
              const detailsMessages = error.details.map((d: any) => d.message || d.path || "").filter(Boolean);
              if (detailsMessages.length > 0) {
                errorMessage = detailsMessages.join("; ");
              } else if (parsedMessage && typeof parsedMessage === "string") {
                errorMessage = parsedMessage;
              }
            } else if (parsedMessage && typeof parsedMessage === "string") {
              errorMessage = parsedMessage;
            }
          } catch (parseError) {
            // Se falhar ao fazer parse, usar a mensagem padrão ou o texto se for curto
            if (responseText.trim() && responseText.trim().length < 200) {
              const textMessage = responseText.trim();
              if (textMessage) {
                errorMessage = textMessage;
              }
            }
          }
        } else if (responseText && responseText.trim() && responseText.trim().length < 200) {
          // Se não for JSON mas houver texto, usar o texto se for curto
          const textMessage = responseText.trim();
          if (textMessage) {
            errorMessage = textMessage;
          }
        }
        
        // Garantir que sempre temos uma mensagem válida e não vazia
        if (typeof errorMessage !== "string" || !errorMessage || errorMessage.trim() === "") {
          errorMessage = `Request failed with status ${response.status}`;
        }
        
        // Garantir que errorMessage é uma string válida antes de usar trim
        let safeErrorMessage: string;
        try {
          if (typeof errorMessage === "string") {
            safeErrorMessage = errorMessage.trim();
          } else {
            safeErrorMessage = String(errorMessage).trim();
          }
          
          // Se ainda estiver vazio, usar mensagem padrão
          if (!safeErrorMessage || safeErrorMessage === "") {
            safeErrorMessage = `Request failed with status ${response.status}`;
          }
        } catch (e) {
          // Se houver qualquer erro, usar mensagem padrão
          safeErrorMessage = `Request failed with status ${response.status}`;
        }
        
        // Garantir que sempre temos uma string não vazia e válida
        let finalMessage: string;
        
        // Usar safeErrorMessage se for válido, senão usar errorMessage, senão usar padrão
        if (safeErrorMessage && typeof safeErrorMessage === "string" && safeErrorMessage.trim()) {
          finalMessage = safeErrorMessage.trim();
        } else if (errorMessage && typeof errorMessage === "string" && errorMessage.trim()) {
          finalMessage = errorMessage.trim();
        } else {
          finalMessage = `Request failed with status ${response.status}`;
        }
        
        // Garantir que finalMessage é sempre uma string válida e não vazia
        if (!finalMessage || typeof finalMessage !== "string" || finalMessage.trim() === "") {
          finalMessage = `Request failed with status ${response.status}`;
        }
        
        // Garantir que finalMessage não é undefined ou null
        const errorMessageToUse: string = String(finalMessage || `Request failed with status ${response.status}`).trim();
        
        const finalError = new Error(errorMessageToUse);
        (finalError as any).status = response.status;
        throw finalError;
      }

      // Se a resposta está ok, fazer parse do JSON
      if (contentType && contentType.includes("application/json") && responseText.trim()) {
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          // Se falhar ao fazer parse mas a resposta está ok, retornar objeto padrão
          console.warn("Failed to parse JSON response:", parseError);
          return { success: true, data: null };
        }
      }
      
      // Se não houver JSON, retornar objeto vazio
      return { success: true, data: null };
      } catch (error: any) {
        // Capturar qualquer erro inesperado e transformá-lo em um erro legível
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(error?.message || String(error) || "An unexpected error occurred");
      }
    },
    onSuccess: () => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}