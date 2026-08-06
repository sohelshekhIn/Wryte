import type { Book } from "@/types/book"

export function findScene(book: Book, sceneId: string) {
  for (const [index, chapter] of book.chapters.entries()) {
    const scene = chapter.scenes.find((s) => s.id === sceneId)
    if (scene) return { chapterNumber: index + 1, chapter, scene }
  }
  return undefined
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function bookWordCount(book: Book): number {
  if (book.chapters.length === 0 && book.wordCount != null) {
    return book.wordCount
  }
  return book.chapters
    .flatMap((ch) => ch.scenes)
    .reduce((total, scene) => total + countWords(scene.body), 0)
}
