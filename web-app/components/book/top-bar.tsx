import Link from "next/link"

import { Button } from "@/components/ui/button"

type TopBarProps = {
  bookTitle: string
  wordCount: number
}

export function TopBar({ bookTitle, wordCount }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-sage-800"
        >
          Wryte
        </Link>
        <div className="h-5 w-px bg-border" />
        <div className="font-serif text-[15px] italic text-ink-700">
          {bookTitle}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-xs text-ink-400">
          {wordCount.toLocaleString("en-US")} words
        </span>
        <Button size="sm" variant="outline">
          Share
        </Button>
      </div>
    </header>
  )
}
