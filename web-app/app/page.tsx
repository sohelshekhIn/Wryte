import Link from "next/link"
import {
  House,
  Library,
  NotebookPen,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getBooks, getWriters } from "@/lib/api/client"
import { mapBook, mapWriter } from "@/lib/api/mappers"
import { bookWordCount } from "@/lib/book-utils"
import type { CoverTone } from "@/types/book"

const COVER_CLASSES: Record<CoverTone, string> = {
  sage: "bg-sage-500 text-white",
  deep: "bg-sage-800 text-sage-100",
  olive: "bg-olive-500 text-sage-50",
}

// ponytail: only "/" is a real route today; the other sections are unrouted
// placeholders until they exist.
const NAV: { id: string; label: string; icon: LucideIcon; active?: boolean }[] =
  [
    { id: "home", label: "Home", icon: House, active: true },
    { id: "library", label: "Library", icon: Library },
    { id: "notes", label: "Notes", icon: NotebookPen },
    { id: "brainstorm", label: "Brainstorm", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ]

function formatCount(n: number): string {
  return n.toLocaleString("en-US")
}

function IconRail() {
  return (
    <nav
      aria-label="Main"
      className="flex w-16 flex-col items-center gap-2 border-r bg-card py-5"
    >
      <div className="mb-4 font-serif text-xl font-bold text-sage-700">W</div>
      {NAV.map(({ id, label, icon: Icon, active }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className={`flex size-10 items-center justify-center rounded-md ${
            active ? "bg-sage-150 text-ink-900/90" : "text-ink-900/50"
          }`}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </button>
      ))}
    </nav>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-right">
      <div className="font-serif text-3xl leading-[1.1] font-semibold text-ink-950">
        {value}
      </div>
      <div className="text-[12.5px] text-muted-foreground">{label}</div>
    </div>
  )
}

export default async function Dashboard() {
  const [apiBooks, apiWriters] = await Promise.all([getBooks(), getWriters()])
  const books = apiBooks.map(mapBook)
  const writer = apiWriters[0] ? mapWriter(apiWriters[0]) : null
  const writerName = writer?.name ?? "Writer"
  const dayStreak = writer?.dayStreak ?? 0
  const totalWords = books.reduce((sum, b) => sum + bookWordCount(b), 0)
  const firstBookId = books[0]?.id

  return (
    <div className="flex h-full">
      <IconRail />
      <div className="flex-1 overflow-y-auto bg-background px-14 py-11">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="mb-1.5 font-serif text-[2rem] leading-[1.22] font-semibold text-ink-950">
              Good evening, {writerName}
            </h1>
            <p className="text-sm text-muted-foreground">
              The page is quiet. Let&apos;s fill it.
            </p>
          </div>
          <div className="flex items-center gap-9">
            <Stat value={formatCount(totalWords)} label="words written" />
            <Stat value={String(dayStreak)} label="day streak" />
            {firstBookId ? (
              <Button asChild className="h-10 px-5">
                <Link href={`/book/${firstBookId}`}>New book</Link>
              </Button>
            ) : (
              <Button className="h-10 px-5" disabled>
                New book
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {books.map((b) => (
            <Link key={b.id} href={`/book/${b.id}`}>
              <Card className="gap-2.5 rounded-2xl p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className={`flex h-[170px] flex-col items-center justify-center gap-2.5 rounded-lg px-6 shadow-[inset_4px_0_0_rgba(0,0,0,0.12)] ${COVER_CLASSES[b.coverTone]}`}
                >
                  <div className="w-7 border-t border-current opacity-60" />
                  <div className="text-center font-serif text-xl leading-[1.3] font-semibold">
                    {b.title}
                  </div>
                  <div className="w-7 border-t border-current opacity-60" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 truncate text-base font-semibold text-foreground">
                    {b.title}
                  </div>
                  <Badge
                    variant={b.status === "final" ? "success" : "neutral"}
                    className="shrink-0"
                  >
                    {b.status}
                  </Badge>
                </div>
                <div className="-mt-1 text-[13px] text-muted-foreground">
                  {b.genre} · {b.chapterCount ?? b.chapters.length} chapters ·{" "}
                  {formatCount(bookWordCount(b))} words
                </div>
                <div
                  role="progressbar"
                  aria-label={`${b.title} progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(b.progress * 100)}
                  className="h-1 rounded-full bg-sage-100"
                >
                  <div
                    className="h-1 rounded-full bg-sage-500"
                    style={{ width: `${b.progress * 100}%` }}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
