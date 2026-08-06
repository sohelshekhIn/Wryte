import { notFound } from "next/navigation"

import { BookWorkspace } from "@/components/book/book-workspace"
import { ApiError, getBook } from "@/lib/api/client"
import { mapBook } from "@/lib/api/mappers"

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let book
  try {
    book = mapBook(await getBook(id))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  return <BookWorkspace book={book} />
}
