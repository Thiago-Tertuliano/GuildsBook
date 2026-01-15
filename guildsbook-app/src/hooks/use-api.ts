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
        throw new Error("Failed to fetch");
      }
      return response.json();
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
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to perform action");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}