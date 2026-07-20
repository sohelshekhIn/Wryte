export type BookStatus = "draft" | "final"

export type CoverTone = "sage" | "deep" | "olive"

export type Scene = {
  id: string
  title: string
  body: string
}

export type Chapter = {
  id: string
  title: string
  status: BookStatus
  scenes: Scene[]
}

export type Book = {
  id: string
  title: string
  genre: string
  status: BookStatus
  /** 0–1 fraction of the manuscript considered done */
  progress: number
  coverTone: CoverTone
  chapters: Chapter[]
}

export type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}
