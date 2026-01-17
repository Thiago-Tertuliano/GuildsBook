// Tipos para resposta da Google Books API
type GoogleBookVolume = {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      description?: string;
      industryIdentifiers?: Array<{ type: string; identifier: string }>;
      pageCount?: number;
      categories?: string[];
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
      language?: string;
    };
  };
  
  type GoogleBooksResponse = {
    items?: GoogleBookVolume[];
    totalItems: number;
  };
  
  // Função para converter livro do Google Books para nosso formato
  function convertGoogleBookToOurFormat(volume: GoogleBookVolume) {
    const { volumeInfo } = volume;
    
    // Extrair ISBN-13 ou ISBN-10
    const isbn = volumeInfo.industryIdentifiers?.find(
      (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
    )?.identifier;
  
    // Extrair primeiro autor (ou "Autor Desconhecido")
    const author = volumeInfo.authors?.[0] || "Autor Desconhecido";
  
    // Extrair ano de publicação
    const publishedYear = volumeInfo.publishedDate
      ? parseInt(volumeInfo.publishedDate.split("-")[0])
      : undefined;
  
    // Extrair gênero/categoria
    const genre = volumeInfo.categories?.[0];
  
    // Extrair capa
    const cover = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;
  
    return {
      title: volumeInfo.title,
      author,
      isbn: isbn || undefined,
      genre,
      publishedYear: publishedYear && publishedYear > 0 ? publishedYear : undefined,
      pages: volumeInfo.pageCount && volumeInfo.pageCount > 0 ? volumeInfo.pageCount : undefined,
      description: volumeInfo.description,
      cover,
      // Dados adicionais da API do Google
      googleBooksId: volume.id,
    };
  }
  
  // Função para buscar livros na API do Google Books
  export async function searchGoogleBooks(query: string, maxResults = 20) {
    try {
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      const baseUrl = "https://www.googleapis.com/books/v1/volumes";
      
      const params = new URLSearchParams({
        q: query,
        maxResults: maxResults.toString(),
        // Removido langRestrict para buscar livros em todos os idiomas
        // Isso aumenta as chances de encontrar livros populares
      });
  
      if (apiKey) {
        params.append("key", apiKey);
      }
  
      const response = await fetch(`${baseUrl}?${params.toString()}`);
  
      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.status}`);
      }
  
      const data: GoogleBooksResponse = await response.json();
  
      if (!data.items || data.items.length === 0) {
        return {
          books: [],
          totalItems: 0,
        };
      }
  
      const books = data.items.map(convertGoogleBookToOurFormat);
  
      return {
        books,
        totalItems: data.totalItems,
      };
    } catch (error) {
      console.error("Erro ao buscar na Google Books API:", error);
      throw error;
    }
  }
  
  // Função para sincronizar livro do Google Books com nosso BD
  export async function syncGoogleBookToDatabase(bookData: ReturnType<typeof convertGoogleBookToOurFormat>) {
    const { prisma } = await import("@/lib/prisma");
  
    // Se tiver ISBN, verificar se já existe
    if (bookData.isbn) {
      const existingBook = await prisma.book.findUnique({
        where: { isbn: bookData.isbn },
      });
  
      if (existingBook) {
        return existingBook;
      }
    }
  
    // Criar livro no nosso BD (remover apenas googleBooksId que não existe no schema)
    const { googleBooksId, ...bookToCreate } = bookData;
  
    const book = await prisma.book.create({
      data: bookToCreate, // Agora inclui cover, title, author, etc.
    });
  
    return book;
  }