import { redirect } from "next/navigation"

import { getBooks } from "@/lib/api/client"

// Legacy entry point — the workspace lives at /book/[id].
export default async function BookIndexPage() {
  const books = await getBooks()
  if (books.length === 0) {
    redirect("/")
  }
  redirect(`/book/${books[0].id}`)
}
