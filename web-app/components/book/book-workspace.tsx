"use client"

import { useState } from "react"

import { BrainstormPanel } from "@/components/book/brainstorm-panel"
import { ManuscriptEditor } from "@/components/book/manuscript-editor"
import { Sidebar } from "@/components/book/sidebar"
import { TopBar } from "@/components/book/top-bar"
import { countWords, findScene } from "@/lib/mock/book"
import type { Book, Chapter, BookStatus } from "@/types/book"

export function BookWorkspace({ book }: { book: Book }) {
  const [chapters, setChapters] = useState<Chapter[]>(book.chapters)
  const [activeSceneId, setActiveSceneId] = useState(
    book.chapters[0].scenes[0].id,
  )
  // Local unsaved edits keyed by scene id; the mock book stays untouched.
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const currentBook = { ...book, chapters }
  // activeSceneId only ever holds ids that exist on this book.
  const { chapterNumber, chapter, scene } = findScene(currentBook, activeSceneId)!
  const body = drafts[scene.id] ?? scene.body

  const wordCount = chapters
    .flatMap((ch) => ch.scenes)
    .reduce((sum, sc) => sum + countWords(drafts[sc.id] ?? sc.body), 0)

  const handleUpdateChapter = (
    chapterId: string,
    updates: { title: string; status: BookStatus },
  ) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, ...updates } : ch)),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar bookTitle={book.title} wordCount={wordCount} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          chapters={chapters}
          activeSceneId={activeSceneId}
          onSelectScene={setActiveSceneId}
          onUpdateChapter={handleUpdateChapter}
        />
        <ManuscriptEditor
          chapterHeading={`Chapter ${chapterNumber} · ${chapter.title}`}
          sceneTitle={scene.title}
          value={body}
          onChange={(value) => setDrafts((d) => ({ ...d, [scene.id]: value }))}
        />
        <BrainstormPanel />
      </div>
    </div>
  )
}

