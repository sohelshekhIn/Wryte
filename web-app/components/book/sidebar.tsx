"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import type { Chapter } from "@/types/book"

type SidebarProps = {
  chapters: Chapter[]
  activeSceneId: string
  onSelectScene: (sceneId: string) => void
}

export function Sidebar({
  chapters,
  activeSceneId,
  onSelectScene,
}: SidebarProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(chapters.map((ch) => [ch.id, true])),
  )

  return (
    <nav
      aria-label="Chapters"
      className="w-[260px] overflow-y-auto border-r bg-background px-3 py-4"
    >
      <div className="px-2 pb-2 text-xs font-semibold tracking-[0.04em] uppercase text-ink-400">
        Chapters
      </div>
      {chapters.map((ch, index) => (
        <div key={ch.id} className="mb-1">
          <button
            type="button"
            aria-expanded={!!open[ch.id]}
            onClick={() => setOpen((o) => ({ ...o, [ch.id]: !o[ch.id] }))}
            className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-left text-sm text-foreground hover:bg-sage-100"
          >
            <span className="min-w-0 truncate">
              {open[ch.id] ? "▾" : "▸"} Chapter {index + 1} — {ch.title}
            </span>
            <Badge variant={ch.status === "final" ? "success" : "neutral"}>
              {ch.status}
            </Badge>
          </button>
          {open[ch.id] && (
            <div className="pl-5">
              {ch.scenes.map((sc) => {
                const active = sc.id === activeSceneId
                return (
                  <button
                    key={sc.id}
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => onSelectScene(sc.id)}
                    className={`block w-full rounded-sm px-2 py-1.5 text-left text-[13px] ${
                      active
                        ? "bg-sage-150 text-sage-800"
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
      ))}
    </nav>
  )
}
