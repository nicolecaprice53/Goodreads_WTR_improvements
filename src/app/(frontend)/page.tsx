import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import ShelfClient, { type ShelfBook } from '@/components/ShelfClient'
import { BOOK_GENRE_LABEL_BY_VALUE } from '@/lib/genres'

const getBooks = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.find({
      collection: 'books',
      depth: 1,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      sort: '-dateAdded',
    })
  },
  ['want-to-read-books-v2'],
  {
    tags: ['books'],
  },
)

function mediaURL(value: unknown) {
  if (typeof value !== 'object' || value === null || !('url' in value)) return undefined
  return typeof value.url === 'string' ? value.url : undefined
}

export default async function HomePage() {
  const result = await getBooks()
  const books: ShelfBook[] = result.docs.map((book) => {
    const dateAdded = book.dateAdded ? new Date(book.dateAdded) : new Date(book.createdAt)
    const friendRatings = book.friendRatings?.map((friend) => ({
      name: friend.name,
      rating: Math.round(friend.rating) === 5 ? (5 as const) : (4 as const),
      photo: mediaURL(friend.profilePhoto),
      review: friend.review ?? undefined,
      ratedAt: friend.ratedAt ?? undefined,
    }))

    return {
      id: String(book.id),
      title: book.title,
      author: book.author,
      rating: book.averageRating,
      ratings: book.ratingCount ?? 0,
      year: book.publicationYear ?? undefined,
      added: new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(dateAdded),
      addedAt: dateAdded.getTime(),
      pages: book.pageCount ?? undefined,
      genres: (book.genres ?? []).map(
        (genre) => BOOK_GENRE_LABEL_BY_VALUE[genre] ?? genre,
      ),
      cover: mediaURL(book.cover),
      friend:
        friendRatings && friendRatings.length > 0
          ? `${friendRatings[0].name.split(' ')[0]} and ${friendRatings.length - 1} others enjoyed this book`
          : undefined,
      friendRatings,
    }
  })

  return <ShelfClient books={books} />
}
