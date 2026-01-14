# 📋 Documentação de Testes - Rotas da API

## 🔍 Busca Externa (Google Books API)

### GET /api/books/external-search

Busca livros na API do Google Books.

#### Parâmetros de Query

- `q` (obrigatório): Termo de busca (título, autor, ISBN)
- `maxResults` (opcional): Número máximo de resultados (padrão: 20)
- `sync` (opcional): Se `true`, sincroniza os resultados com o banco de dados local

---

### Teste 1: Busca sem sincronização

**Request:**
```
GET /api/books/external-search?q=1984
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "title": "FEC reports on financial activity, 1983-1984",
        "author": "Autor Desconhecido",
        "genre": "Campaign funds",
        "publishedYear": 1985,
        "pages": 568,
        "cover": "http://books.google.com/books/content?id=_9TlRrrfsnUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "googleBooksId": "_9TlRrrfsnUC"
      },
      {
        "title": "Arctic National Wildlife Refuge Coastal Plain Resource Assessment, 1984 Update Report, Baseline Study of the Fish, Wildlife, and Their Habitats",
        "author": "Gerald Warren Garner",
        "genre": "Animals",
        "publishedYear": 1985,
        "pages": 460,
        "description": "Summarizes work completed or on-going in 1984...",
        "cover": "http://books.google.com/books/content?id=s2b5ON4NvN0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "googleBooksId": "s2b5ON4NvN0C"
      },
      {
        "title": "Comprehensive Organic Functional Group Transformations",
        "author": "Alan R. Katritzky",
        "isbn": "0080423221",
        "genre": "Mathematics",
        "publishedYear": 1995,
        "pages": 1452,
        "description": "This Volume covers the formation of carbon-carbon...",
        "cover": "http://books.google.com/books/content?id=0ukR60lO5S8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "googleBooksId": "0ukR60lO5S8C"
      }
      // ... mais 17 livros
    ],
    "totalItems": 1000000,
    "synced": false
  }
}
```

**Observações:**
- Retorna apenas dados da API do Google Books
- Não salva no banco de dados local
- Campo `synced: false` indica que não foi sincronizado

---

### Teste 2: Busca com sincronização

**Request:**
```
GET /api/books/external-search?q=1984&sync=true
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": "a10ffb44-9d49-429d-99c0-ff8c0e68fb60",
        "title": "FEC reports on financial activity, 1983-1984",
        "author": "Autor Desconhecido",
        "isbn": null,
        "cover": "http://books.google.com/books/content?id=_9TlRrrfsnUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "genre": "Campaign funds",
        "publishedYear": 1985,
        "description": null,
        "pages": 568,
        "createdAt": "2026-01-14T23:06:12.777Z",
        "updatedAt": "2026-01-14T23:06:12.777Z"
      },
      {
        "id": "98731333-5ec4-434b-81c1-61ed3c85277a",
        "title": "Arctic National Wildlife Refuge Coastal Plain Resource Assessment, 1984 Update Report, Baseline Study of the Fish, Wildlife, and Their Habitats",
        "author": "Gerald Warren Garner",
        "isbn": null,
        "cover": "http://books.google.com/books/content?id=s2b5ON4NvN0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "genre": "Animals",
        "publishedYear": 1985,
        "description": "Summarizes work completed or on-going in 1984...",
        "pages": 460,
        "createdAt": "2026-01-14T23:06:12.777Z",
        "updatedAt": "2026-01-14T23:06:12.777Z"
      },
      {
        "id": "fe9e9cb8-7f44-4c0d-9ef0-0f6625d6d9a1",
        "title": "Comprehensive Organic Functional Group Transformations",
        "author": "Alan R. Katritzky",
        "isbn": "0080423221",
        "cover": "http://books.google.com/books/content?id=0ukR60lO5S8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        "genre": "Mathematics",
        "publishedYear": 1995,
        "description": "This Volume covers the formation of carbon-carbon...",
        "pages": 1452,
        "createdAt": "2026-01-14T23:06:13.343Z",
        "updatedAt": "2026-01-14T23:06:13.343Z"
      }
      // ... mais 17 livros
    ],
    "totalItems": 1000000,
    "synced": true
  }
}
```

**Observações:**
- Retorna livros salvos no banco de dados local
- Inclui campos `id`, `createdAt`, `updatedAt`
- Campo `synced: true` indica que foi sincronizado
- Livros duplicados (mesmo ISBN) não são criados novamente

---

## 📝 Notas

- **Data dos Testes**: 14/01/2026
- **Ambiente**: Desenvolvimento local
- **Status**: ✅ Funcionando corretamente
- **Total de livros retornados**: 20 (padrão do maxResults)
- **Total de resultados disponíveis**: 1.000.000 (conforme Google Books API)
