"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ChapterModal } from "@/components/book/chapter-modal"
import type { Chapter, BookStatus } from "@/types/book"

type SidebarProps = {
  chapters: Chapter[]
  activeSceneId: string
  onSelectScene: (sceneId: string) => void
  onUpdateChapter?: (
    chapterId: string,
    updates: { title: string; status: BookStatus },
  ) => void
}

export function Sidebar({
  chapters,
  activeSceneId,
  onSelectScene,
  onUpdateChapter,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(chapters.map((ch) => [ch.id, true])),
  )
  const [modalChapter, setModalChapter] = useState<{
    chapter: Chapter
    index: number
  } | null>(null)

  const handleNavigateChapter = (chapterId: string) => {
    // Expand chapter in sidebar
    setOpen((o) => ({ ...o, [chapterId]: true }))

    // Find and select the first scene of this chapter
    const targetChapter = chapters.find((ch) => ch.id === chapterId)
    if (targetChapter && targetChapter.scenes.length > 0) {
      onSelectScene(targetChapter.scenes[0].id)
    }
  }

  const handleSaveChapter = (
    chapterId: string,
    updates: { title: string; status: BookStatus },
  ) => {
    onUpdateChapter?.(chapterId, updates)
  }

  return (
    <>
      <nav
        aria-label="Chapters"
        className="w-[260px] overflow-y-auto border-r bg-background px-3 py-4"
      >
        <div className="px-2 pb-2 text-xs font-semibold tracking-[0.04em] uppercase text-ink-400">
          Chapters
        </div>
        {chapters.map((ch, index) => {
          const isOpen = !!open[ch.id]
          return (
            <div key={ch.id} className="mb-1">
              <div className="group flex w-full items-center justify-between gap-1 rounded-md p-1.5 hover:bg-sage-100 transition-colors">
                <button
                  type="button"
                  aria-label={isOpen ? "Collapse scenes" : "Expand scenes"}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen((o) => ({ ...o, [ch.id]: !o[ch.id] }))
                  }}
                  className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-sage-200/60"
                >
                  {isOpen ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </button>

                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setModalChapter({ chapter: ch, index })}
                  className="flex flex-1 items-center justify-between gap-2 min-w-0 text-left text-sm font-medium text-foreground py-0.5"
                >
                  <span className="min-w-0 truncate">
                    Chapter {index + 1} — {ch.title}
                  </span>
                  <Badge
                    variant={ch.status === "final" ? "success" : "neutral"}
                    className="shrink-0"
                  >
                    {ch.status}
                  </Badge>
                </button>
              </div>

              {isOpen && (
                <div className="pl-6 pt-0.5 space-y-0.5">
                  {ch.scenes.map((sc) => {
                    const active = sc.id === activeSceneId
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        aria-current={active ? "true" : undefined}
                        onClick={() => onSelectScene(sc.id)}
                        className={`block w-full rounded-sm px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                          active
                            ? "bg-sage-150 font-medium text-sage-800"
                            : "text-muted-foreground hover:bg-sage-100"
                        }`}
                      >
                        {sc.title}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Chapter Popup Modal */}
      <ChapterModal
        chapter={modalChapter?.chapter ?? null}
        index={modalChapter?.index ?? 0}
        isOpen={modalChapter !== null}
        onClose={() => setModalChapter(null)}
        onNavigate={handleNavigateChapter}
        onSave={handleSaveChapter}
      />
    </>
  )
}

