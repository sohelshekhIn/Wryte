"use client"

import { useState, useEffect } from "react"
import { Compass, Edit3, X, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Chapter, BookStatus } from "@/types/book"

type ChapterModalProps = {
  chapter: Chapter | null
  index: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (chapterId: string) => void
  onSave: (chapterId: string, updates: { title: string; status: BookStatus }) => void
}

export function ChapterModal({
  chapter,
  index,
  isOpen,
  onClose,
  onNavigate,
  onSave,
}: ChapterModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview")
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<BookStatus>("draft")

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title)
      setStatus(chapter.status)
      setActiveTab("overview")
    }
  }, [chapter])

  if (!isOpen || !chapter) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave(chapter.id, { title: title.trim(), status })
    onClose()
  }

  const handleNavigate = () => {
    onNavigate(chapter.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-xl border bg-background p-6 shadow-xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Chapter {index + 1}
          </div>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            {chapter.title}
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "border-sage-600 text-sage-800"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass className="size-4" />
            Navigate & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "border-sage-600 text-sage-800"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="size-4" />
            Edit Info
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <div className="space-y-5">
            <div className="rounded-lg border bg-sage-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant={chapter.status === "final" ? "success" : "neutral"}>
                  {chapter.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Scenes</span>
                <span className="text-sm font-medium">{chapter.scenes.length} scenes</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleNavigate}
                className="flex-1 gap-2"
              >
                <Compass className="size-4" />
                Go to Chapter
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab("edit")}
                className="gap-2"
              >
                <Edit3 className="size-4" />
                Edit Info
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Chapter Title</Label>
              <Input
                id="chapter-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter chapter title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`flex items-center justify-center gap-2 rounded-md border p-2.5 text-sm transition-all ${
                    status === "draft"
                      ? "border-sage-600 bg-sage-100/60 font-medium text-sage-900"
                      : "border-border hover:bg-sage-50 text-muted-foreground"
                  }`}
                >
                  {status === "draft" && <Check className="size-4 text-sage-600" />}
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("final")}
                  className={`flex items-center justify-center gap-2 rounded-md border p-2.5 text-sm transition-all ${
                    status === "final"
                      ? "border-emerald-600 bg-emerald-100/60 font-medium text-emerald-900"
                      : "border-border hover:bg-sage-50 text-muted-foreground"
                  }`}
                >
                  {status === "final" && <Check className="size-4 text-emerald-600" />}
                  Final
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
