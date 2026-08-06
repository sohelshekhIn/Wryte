"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createBookMessage, getBookMessages } from "@/lib/api/client"
import { mapChatMessage } from "@/lib/api/mappers"
import type { ChatMessage } from "@/types/book"

export function BrainstormPanel({ bookId }: { bookId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let cancelled = false
    void getBookMessages(bookId)
      .then((rows) => {
        if (!cancelled) setMessages(rows.map(mapChatMessage))
      })
      .catch(() => {
        if (!cancelled) setMessages([])
      })
    return () => {
      cancelled = true
    }
  }, [bookId])

  // ponytail: no AI backend yet — Send persists the user message only.
  // Upgrade path: stream an assistant reply after POST.
  async function send() {
    const content = input.trim()
    if (!content || sending) return
    setSending(true)
    setInput("")
    try {
      const saved = await createBookMessage(bookId, { role: "user", content })
      setMessages((m) => [...m, mapChatMessage(saved)])
    } catch {
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex w-80 flex-col border-l bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-3.5">
        <span className="size-2 rounded-full bg-sage-500" />
        <span className="text-sm font-semibold text-foreground">
          Brainstorm
        </span>
        <span className="ml-auto font-serif text-xs italic text-ink-400">
          knows your story
        </span>
      </div>
      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`max-w-[88%] rounded-lg px-3 py-2.5 text-sm leading-[1.55] whitespace-pre-line ${
              m.role === "user"
                ? "self-end bg-sage-500 text-white"
                : "self-start bg-sage-100 text-foreground"
            }`}
          >
            {m.content}
          </li>
        ))}
      </ul>
      <form
        className="flex flex-col gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault()
          void send()
        }}
      >
        <Textarea
          rows={2}
          aria-label="Brainstorm message"
          placeholder="Ask for ideas, a synonym, a plot twist..."
          className="bg-card"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" size="sm" disabled={sending}>
          Send
        </Button>
      </form>
    </div>
  )
}
