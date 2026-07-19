import { notFound } from "next/navigation"

import { BookWorkspace } from "@/components/book/book-workspace"
import { getBook } from "@/lib/mock/book"

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = getBook(id)
  if (!book) notFound()

  return <BookWorkspace book={book} />
}
