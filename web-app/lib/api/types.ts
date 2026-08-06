import type { BookStatus, CoverTone } from "@/types/book"

export type ApiBook = {
  id: number
  title: string
  genre: string | null
  target_word_count: number
  status: BookStatus
  progress: number
  cover_tone: CoverTone
  writer_id: number | null
  word_count: number
  chapter_count: number
}

export type ApiScene = {
  id: number
  chapter_id: number
  title: string
  body: string
  position: number
}

export type ApiChapter = {
  id: number
  book_id: number
  title: string
  status: BookStatus
  position: number
  scenes: ApiScene[]
}

export type ApiBookDetail = ApiBook & {
  chapters: ApiChapter[]
}

export type ApiWriter = {
  id: number
  name: string
  day_streak: number
}

export type ApiChatMessage = {
  id: number
  book_id: number
  role: "assistant" | "user"
  content: string
  created_at: string
}
