import type {
  ApiBook,
  ApiBookDetail,
  ApiChapter,
  ApiChatMessage,
  ApiScene,
  ApiWriter,
} from "@/lib/api/types"
import type { Book, Chapter, ChatMessage, Scene } from "@/types/book"

export type Writer = {
  id: string
  name: string
  dayStreak: number
}

function mapScene(scene: ApiScene): Scene {
  return {
    id: String(scene.id),
    title: scene.title,
    body: scene.body,
  }
}

function mapChapter(chapter: ApiChapter): Chapter {
  return {
    id: String(chapter.id),
    title: chapter.title,
    status: chapter.status,
    scenes: (chapter.scenes ?? []).map(mapScene),
  }
}

export function mapBook(book: ApiBook | ApiBookDetail): Book {
  const chapters =
    "chapters" in book && book.chapters ? book.chapters.map(mapChapter) : []

  return {
    id: String(book.id),
    title: book.title,
    genre: book.genre ?? "",
    status: book.status,
    progress: book.progress,
    coverTone: book.cover_tone,
    chapters,
    wordCount: book.word_count,
    chapterCount: book.chapter_count,
  }
}

export function mapWriter(writer: ApiWriter): Writer {
  return {
    id: String(writer.id),
    name: writer.name,
    dayStreak: writer.day_streak,
  }
}

export function mapChatMessage(message: ApiChatMessage): ChatMessage {
  return {
    id: String(message.id),
    role: message.role,
    content: message.content,
  }
}
