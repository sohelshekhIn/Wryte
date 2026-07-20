import type { Book, ChatMessage } from "@/types/book"

// ponytail: no backend yet — this module is the single source of truth for
// demo data. Swap it for real data access without touching the views.

export const WRITER = {
  name: "Sohel",
  dayStreak: 18,
}

export const BOOKS: Book[] = [
  {
    id: "the-last-garden",
    title: "The Last Garden",
    genre: "Fantasy",
    status: "draft",
    progress: 0.62,
    coverTone: "sage",
    chapters: [
      {
        id: "ch-1",
        title: "The Arrival",
        status: "final",
        scenes: [
          {
            id: "morning-fog",
            title: "Morning fog",
            body: "Marianne stepped off the coach into a fog so thick the village seemed to be deciding, house by house, whether to exist.",
          },
          {
            id: "the-old-gate",
            title: "The old gate",
            body: "The gate to Wren Cottage hung on one hinge, painted a green that had once meant something to somebody.",
          },
        ],
      },
      {
        id: "ch-2",
        title: "The Garden",
        status: "final",
        scenes: [
          {
            id: "first-bloom",
            title: "First bloom",
            body: "By April the garden had forgiven her. A single hellebore opened under the kitchen window, the color of weak tea.",
          },
          {
            id: "a-strangers-note",
            title: "A stranger's note",
            body: "The note was pinned to the potting shed door with a rose thorn: You planted them too deep. — E.",
          },
        ],
      },
      {
        id: "ch-3",
        title: "The Storm",
        status: "draft",
        scenes: [
          {
            id: "dark-clouds",
            title: "Dark clouds",
            body: "The clouds rolled in from the west long before Marianne noticed them. She was kneeling in the herb bed, fingers deep in soil, when the first gust rattled the gate she had oiled only that morning.\n\nShe looked up. The sky had gone the color of a bruise, and somewhere beyond the hedge a door was banging against its frame, over and over, like something trying to get out.",
          },
          { id: "the-letter", title: "The letter", body: "" },
          { id: "aftermath", title: "Aftermath", body: "" },
        ],
      },
      {
        id: "ch-4",
        title: "Revelations",
        status: "draft",
        scenes: [{ id: "old-photographs", title: "Old photographs", body: "" }],
      },
    ],
  },
  {
    id: "letters-from-the-coast",
    title: "Letters from the Coast",
    genre: "Literary fiction",
    status: "final",
    progress: 1,
    coverTone: "deep",
    chapters: [
      {
        id: "coast-1",
        title: "Salt",
        status: "final",
        scenes: [
          {
            id: "the-first-letter",
            title: "The first letter",
            body: "Dear June — the sea here is not blue, whatever the postcards promised you.",
          },
        ],
      },
      {
        id: "coast-2",
        title: "Driftwood",
        status: "final",
        scenes: [{ id: "what-washes-up", title: "What washes up", body: "" }],
      },
      {
        id: "coast-3",
        title: "Harbor Lights",
        status: "final",
        scenes: [{ id: "the-last-letter", title: "The last letter", body: "" }],
      },
    ],
  },
  {
    id: "untitled-mystery",
    title: "Untitled Mystery",
    genre: "Mystery",
    status: "draft",
    progress: 0.14,
    coverTone: "olive",
    chapters: [
      {
        id: "mys-1",
        title: "The Orchard",
        status: "draft",
        scenes: [
          {
            id: "the-find",
            title: "The find",
            body: "The apples had fallen early that year, and so, it turned out, had Mr. Pettigrew.",
          },
        ],
      },
      {
        id: "mys-2",
        title: "Questions",
        status: "draft",
        scenes: [{ id: "the-inspector", title: "The inspector", body: "" }],
      },
    ],
  },
]

export const BRAINSTORM_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    role: "assistant",
    content:
      "Want a few ideas for what's behind that banging door? I can keep it grounded in Marianne's POV or lean into the storm as an omen.",
  },
  {
    id: "m-2",
    role: "user",
    content: "Give me 3 options that feel ominous but not supernatural.",
  },
  {
    id: "m-3",
    role: "assistant",
    content:
      "1. A shutter she forgot to latch — but it wasn't loose yesterday.\n2. Her brother's old bicycle, blown from the shed.\n3. The garden gate itself, though she just fixed the hinge.",
  },
]

export function getBook(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id)
}

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
  return book.chapters
    .flatMap((ch) => ch.scenes)
    .reduce((total, scene) => total + countWords(scene.body), 0)
}
