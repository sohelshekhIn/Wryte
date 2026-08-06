import type {
  ApiBook,
  ApiBookDetail,
  ApiChatMessage,
  ApiWriter,
} from "@/lib/api/types"

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.")
  }
  return base.replace(/\/$/, "")
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = (await res.json()) as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(res.status, detail)
  }

  return res.json() as Promise<T>
}

export function getBooks(): Promise<ApiBook[]> {
  return apiFetch<ApiBook[]>("/books/")
}

export function getBook(id: string | number): Promise<ApiBookDetail> {
  return apiFetch<ApiBookDetail>(`/books/${id}`)
}

export function getWriters(): Promise<ApiWriter[]> {
  return apiFetch<ApiWriter[]>("/writers/")
}

export function getBookMessages(
  bookId: string | number,
): Promise<ApiChatMessage[]> {
  return apiFetch<ApiChatMessage[]>(`/books/${bookId}/messages/`)
}

export function createBookMessage(
  bookId: string | number,
  body: { role: "assistant" | "user"; content: string },
): Promise<ApiChatMessage> {
  return apiFetch<ApiChatMessage>(`/books/${bookId}/messages/`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}
