// Tipos comuns para a aplicação
export type BookStatus = "QUERO_LER" | "LENDO" | "LIDO";

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type BookClubRole = "OWNER" | "MODERATOR" | "MEMBER";

// Tipos de resposta da API
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

// Tipos para paginacão
export type PaginationParams = {
    page?: number;
    limit?: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
};