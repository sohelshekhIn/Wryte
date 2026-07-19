import { redirect } from "next/navigation"

import { BOOKS } from "@/lib/mock/book"

// Legacy entry point — the workspace lives at /book/[id].
export default function BookIndexPage() {
  redirect(`/book/${BOOKS[0].id}`)
}
