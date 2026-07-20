"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BRAINSTORM_MESSAGES } from "@/lib/mock/book"
import type { ChatMessage } from "@/types/book"

export function BrainstormPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(BRAINSTORM_MESSAGES)
  const [input, setInput] = useState("")

  // ponytail: no AI backend yet — Send only appends the user's message
  // locally. Upgrade path: POST to an API route and stream the reply.
  function send() {
    const content = input.trim()
    if (!content) return
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", content },
    ])
    setInput("")
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
          send()
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
        <Button type="submit" size="sm">
          Send
        </Button>
      </form>
    </div>
  )
}
