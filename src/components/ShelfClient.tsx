'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { BOOK_GENRE_LABELS } from '@/lib/genres'

export type ShelfBook = {
  id: string
  title: string
  author: string
  rating: number
  ratings: number
  year?: number
  added: string
  addedAt: number
  pages?: number
  genres: string[]
  cover?: string
  friend?: string
  friendRatings?: FriendRating[]
}

type FriendRating = {
  name: string
  rating: 4 | 5
  photo?: string
  review?: string
  ratedAt?: string
}

type SortKey =
  | 'Date Added'
  | 'Date Updated'
  | 'Position'
  | 'Title'
  | 'Author'
  | 'Average Rating'
  | 'Number of Ratings'
  | 'Publication Year'
  | 'Number of Pages'
  | 'Owned'
  | 'Has the Cover'

const sortOptions: SortKey[] = [
  'Date Added',
  'Date Updated',
  'Position',
  'Title',
  'Author',
  'Average Rating',
  'Number of Ratings',
  'Publication Year',
  'Number of Pages',
  'Owned',
  'Has the Cover',
]

const genreOptions = BOOK_GENRE_LABELS

type Theme = 'light' | 'dark'

function Icon({
  name,
  size = 24,
}: {
  name: 'back' | 'more' | 'filter' | 'check' | 'close' | 'sort' | 'sun' | 'moon'
  size?: number
}) {
  const paths = {
    back: <path d="m15 18-6-6 6-6" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
    filter: <path d="M4 5h16l-6.3 7.2v5.3L10.3 20v-7.8L4 5Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    sort: <path d="M12 5v14m0 0-5-5m5 5 5-5" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)

  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span className={star <= filled ? 'star-fill' : 'star-empty'} key={star}>
          ★
        </span>
      ))}
    </span>
  )
}

function ProfilePicture({
  friend,
  className,
}: {
  friend: FriendRating
  className: string
}) {
  if (friend.photo) {
    return (
      <Image
        className={className}
        src={friend.photo}
        alt={`${friend.name}'s profile`}
        width={96}
        height={96}
      />
    )
  }

  return (
    <span className={`${className} profile-placeholder`} aria-label={`${friend.name} has no photo`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6" />
      </svg>
    </span>
  )
}

function BookRow({
  book,
  onOpenFriends,
}: {
  book: ShelfBook
  onOpenFriends: (book: ShelfBook) => void
}) {
  return (
    <article className="book-row">
      {book.cover ? (
        <Image
          className="book-cover"
          src={book.cover}
          alt={`Cover of ${book.title}`}
          width={236}
          height={356}
        />
      ) : (
        <div className="book-cover cover-placeholder" aria-label={`${book.title} has no cover`}>
          <span>{book.title}</span>
        </div>
      )}
      <div className="book-copy">
        <h2>{book.title}</h2>
        <p className="author">by {book.author}</p>
        <div className="rating-line">
          <Stars rating={book.rating} />
          <span>{book.rating.toFixed(2)}</span>
          {book.ratings > 0 && (
            <>
              <span className="dot">·</span>
              <span>{book.ratings.toLocaleString()} ratings</span>
            </>
          )}
          {book.year && (
            <>
              <span className="dot">·</span>
              <span>{book.year}</span>
            </>
          )}
        </div>
        <p className="date-added">Date Added: {book.added}</p>
        {book.friend && book.friendRatings && (
          <button className="friend-note" onClick={() => onOpenFriends(book)}>
            <ProfilePicture friend={book.friendRatings[0]} className="avatar" />
            <span>
              <strong>{book.friend.split(' enjoyed')[0]}</strong> enjoyed this book
            </span>
          </button>
        )}
      </div>
    </article>
  )
}

const timeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
]

function timeAgo(date: string) {
  const elapsed = Date.now() - new Date(date).getTime()
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'always' })
  for (const [unit, ms] of timeUnits) {
    if (elapsed >= ms) return format.format(-Math.floor(elapsed / ms), unit)
  }
  return 'just now'
}

function FriendsSheet({ book, onClose }: { book: ShelfBook; onClose: () => void }) {
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-labelledby="friends-title">
      <button className="sheet-scrim" aria-label="Close friend ratings and reviews" onClick={onClose} />
      <section className="sheet friends-sheet">
        <header className="friends-header">
          <h2 id="friends-title">Friend Ratings and Reviews</h2>
          <button className="friends-close" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={22} />
          </button>
        </header>
        <div className="friends-list">
          {book.friendRatings?.map((friend) => (
            <div className="friend-rating-row" key={friend.name}>
              <ProfilePicture friend={friend} className="friend-avatar" />
              <div className="friend-review">
                <p className="friend-review-heading">
                  <strong>{friend.name}</strong> rated it <Stars rating={friend.rating} />
                </p>
                {friend.ratedAt && (
                  <p className="friend-review-time" suppressHydrationWarning>
                    {timeAgo(friend.ratedAt)}
                  </p>
                )}
                {friend.review &&<p className="friend-review-text">{friend.review}</p>}
                <div className="friend-review-actions">
                  <button>Like</button>
                  <span className="dot">·</span>
                  <button>Comment</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SortSheet({
  selected,
  onSelect,
  onClose,
}: {
  selected: SortKey
  onSelect: (value: SortKey) => void
  onClose: () => void
}) {
  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-labelledby="sort-title">
      <button className="sheet-scrim" aria-label="Close sort options" onClick={onClose} />
      <section className="sheet sort-sheet">
        <header className="sheet-header">
          <button className="outline-button" onClick={onClose}>
            Close
          </button>
          <h2 id="sort-title">Sort By</h2>
          <span className="header-spacer" />
        </header>
        <div className="option-list">
          {sortOptions.map((option) => (
            <button
              className="option-row"
              key={option}
              onClick={() => {
                onSelect(option)
                onClose()
              }}
            >
              <span>{option}</span>
              {selected === option && <Icon name="check" size={28} />}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

type Filters = {
  genres: string[]
  shelves: string[]
  author: string
  yearFrom: string
  yearTo: string
  pagesFrom: string
  pagesTo: string
  rating: number
}

const emptyFilters: Filters = {
  genres: [],
  shelves: [],
  author: '',
  yearFrom: '',
  yearTo: '',
  pagesFrom: '',
  pagesTo: '',
  rating: 0,
}

const starPath =
  'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'

function StarRow() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 24 24" aria-hidden="true">
          <path d={starPath} />
        </svg>
      ))}
    </>
  )
}

function StarFillRow({ value }: { value: number }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const fill = Math.min(1, Math.max(0, value - starIndex))
        const visualFill = fill === 0.25 ? 0.37 : fill === 0.75 ? 0.63 : fill
        const isFractional = fill > 0 && fill < 1

        return (
          <svg
            className={isFractional ? 'fractional' : undefined}
            key={starIndex}
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ clipPath: `inset(0 ${(1 - visualFill) * 100}% 0 0)` }}
          >
            <path d={starPath} />
          </svg>
        )
      })}
    </>
  )
}

const ratingStep = 0.25
const roundToStep = (value: number) => Math.round(value / ratingStep) * ratingStep
const clampRating = (value: number) => Math.min(5, Math.max(0, roundToStep(value)))

function StarSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [dragging, setDragging] = useState(false)

  const valueFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return clampRating(((event.clientX - rect.left) / rect.width) * 5)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowRight: value + ratingStep,
      ArrowUp: value + ratingStep,
      ArrowLeft: value - ratingStep,
      ArrowDown: value - ratingStep,
      PageUp: value + 1,
      PageDown: value - 1,
      Home: 0,
      End: 5,
    }
    if (!(event.key in steps)) return
    event.preventDefault()
    onChange(clampRating(steps[event.key]))
  }

  return (
    <div className="star-slider">
      <div
        className={`star-slider-track${dragging ? ' dragging' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Minimum average rating"
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={value}
        aria-valuetext={value ? `${value.toFixed(2)} stars and up` : 'Any rating'}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
          onChange(valueFromPointer(event))
        }}
        onPointerMove={(event) => {
          if (dragging) onChange(valueFromPointer(event))
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={onKeyDown}
      >
        <div className="star-slider-row">
          <StarRow />
        </div>
        <div className="star-slider-row star-slider-fill">
          <StarFillRow value={value} />
        </div>
      </div>
      <span className="star-slider-value">
        {value ? (
          <>
            <strong>{value.toFixed(2)}</strong> &amp; up
          </>
        ) : (
          'Any rating'
        )}
      </span>
    </div>
  )
}

const maxAuthorSuggestions = 6

function AuthorField({
  authors,
  value,
  onChange,
}: {
  authors: string[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const query = value.trim().toLowerCase()
  const suggestions = query
    ? authors
        .filter((author) => author.toLowerCase().includes(query) && author.toLowerCase() !== query)
        // Names that start with what was typed come first
        .sort(
          (a, b) =>
            Number(!a.toLowerCase().startsWith(query)) - Number(!b.toLowerCase().startsWith(query)),
        )
        .slice(0, maxAuthorSuggestions)
    : []
  const showSuggestions = open && suggestions.length > 0

  const choose = (author: string) => {
    onChange(author)
    setOpen(false)
    setHighlighted(-1)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((index) => (index + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
    } else if (event.key === 'Enter' && highlighted >= 0) {
      event.preventDefault()
      choose(suggestions[highlighted])
    } else if (event.key === 'Escape') {
      event.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div className="field-label author-field">
      <label htmlFor="author-filter">Author</label>
      <input
        id="author-filter"
        type="text"
        placeholder="Any author"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls="author-suggestions"
        aria-activedescendant={highlighted >= 0 ? `author-suggestion-${highlighted}` : undefined}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setHighlighted(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {showSuggestions && (
        <ul className="author-suggestions" id="author-suggestions" role="listbox">
          {suggestions.map((author, index) => (
            <li
              key={author}
              id={`author-suggestion-${index}`}
              role="option"
              aria-selected={index === highlighted}
              className={index === highlighted ? 'highlighted' : ''}
              // mousedown fires before the input's blur, so the list is still there to click
              onMouseDown={(event) => {
                event.preventDefault()
                choose(author)
              }}
              onMouseEnter={() => setHighlighted(index)}
            >
              {author}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Prototype: stands in for the user's own shelves, and every book is on all of them
const userShelves = ['owned', 'library', 'spotify']

function ShelvesField({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (shelves: string[]) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const search = query.trim().toLowerCase()
  const suggestions = userShelves
    .filter((shelf) => !selected.includes(shelf) && shelf.includes(search))
    .sort((a, b) => Number(!a.startsWith(search)) - Number(!b.startsWith(search)))
  const showList = open && (suggestions.length > 0 || search !== '')

  const add = (shelf: string) => {
    onChange([...selected, shelf])
    setQuery('')
    setHighlighted(-1)
  }

  const remove = (shelf: string) => onChange(selected.filter((item) => item !== shelf))

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !query && selected.length) {
      remove(selected[selected.length - 1])
    } else if (!showList || !suggestions.length) {
      return
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((index) => (index + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
    } else if (event.key === 'Enter' && (highlighted >= 0 || suggestions.length === 1)) {
      event.preventDefault()
      add(suggestions[Math.max(highlighted, 0)])
    } else if (event.key === 'Escape') {
      event.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div className="field-label author-field shelves-field">
      <label htmlFor="shelves-filter">Mutual Shelves</label>
      <div
        className="shelf-input"
        onClick={(event) => event.currentTarget.querySelector('input')?.focus()}
      >
        {selected.map((shelf) => (
          <span className="shelf-chip" key={shelf}>
            {shelf}
            <button
              type="button"
              aria-label={`Remove ${shelf} shelf filter`}
              onClick={() => remove(shelf)}
            >
              <Icon name="close" size={14} />
            </button>
          </span>
        ))}
        <input
          id="shelves-filter"
          type="text"
          placeholder={selected.length ? 'Add another shelf…' : 'Search your shelves'}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls="shelf-suggestions"
          aria-activedescendant={highlighted >= 0 ? `shelf-suggestion-${highlighted}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setHighlighted(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
      </div>
      {showList && (
        <ul className="author-suggestions" id="shelf-suggestions" role="listbox">
          {suggestions.length ? (
            suggestions.map((shelf, index) => (
              <li
                key={shelf}
                id={`shelf-suggestion-${index}`}
                role="option"
                aria-selected={index === highlighted}
                className={index === highlighted ? 'highlighted' : ''}
                onMouseDown={(event) => {
                  event.preventDefault()
                  add(shelf)
                }}
                onMouseEnter={() => setHighlighted(index)}
              >
                {shelf}
              </li>
            ))
          ) : (
            <li className="no-match">No shelves match “{query.trim()}”</li>
          )}
        </ul>
      )}
      <p className="field-hint">
        {selected.length
          ? `${selected.length} selected · add more to narrow to books on every shelf`
          : 'Select one or more shelves'}
      </p>
    </div>
  )
}

function FilterSheet({
  initial,
  authors,
  onApply,
  onClose,
}: {
  initial: Filters
  authors: string[]
  onApply: (filters: Filters) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Filters>(initial)

  const toggleGenre = (genre: string) =>
    setDraft((current) => ({
      ...current,
      genres: current.genres.includes(genre)
        ? current.genres.filter((item) => item !== genre)
        : [...current.genres, genre],
    }))

  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-labelledby="filter-title">
      <button className="sheet-scrim" aria-label="Close filters" onClick={onClose} />
      <section className="sheet filter-sheet">
        <header className="sheet-header">
          <button className="outline-button" onClick={onClose}>
            Close
          </button>
          <h2 id="filter-title">Filter By</h2>
          <button className="clear-button" onClick={() => setDraft(emptyFilters)}>
            Clear
          </button>
        </header>

        <div className="filter-content">
          <fieldset>
            <legend>Genre</legend>
            <div className="genre-grid">
              {genreOptions.map((genre) => (
                <label className="check-label" key={genre}>
                  <input
                    type="checkbox"
                    checked={draft.genres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  <span className="custom-check">
                    {draft.genres.includes(genre) && <Icon name="check" size={16} />}
                  </span>
                  {genre}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Average Rating</legend>
            <StarSlider
              value={draft.rating}
              onChange={(rating) => setDraft((current) => ({ ...current, rating }))}
            />
          </fieldset>

          <fieldset>
            <legend>Pages</legend>
            <div className="range-row">
              <label>
                <span>From</span>
                <input
                  inputMode="numeric"
                  placeholder="Any"
                  value={draft.pagesFrom}
                  onChange={(event) => setDraft({ ...draft, pagesFrom: event.target.value })}
                />
              </label>
              <span className="range-dash">—</span>
              <label>
                <span>To</span>
                <input
                  inputMode="numeric"
                  placeholder="Any"
                  value={draft.pagesTo}
                  onChange={(event) => setDraft({ ...draft, pagesTo: event.target.value })}
                />
              </label>
            </div>
          </fieldset>

          <ShelvesField
            selected={draft.shelves}
            onChange={(shelves) => setDraft((current) => ({ ...current, shelves }))}
          />

          <AuthorField
            authors={authors}
            value={draft.author}
            onChange={(author) => setDraft((current) => ({ ...current, author }))}
          />

          <fieldset>
            <legend>Publication Year</legend>
            <div className="range-row">
              <label>
                <span>From</span>
                <input
                  inputMode="numeric"
                  placeholder="Any"
                  value={draft.yearFrom}
                  onChange={(event) => setDraft({ ...draft, yearFrom: event.target.value })}
                />
              </label>
              <span className="range-dash">—</span>
              <label>
                <span>To</span>
                <input
                  inputMode="numeric"
                  placeholder="Any"
                  value={draft.yearTo}
                  onChange={(event) => setDraft({ ...draft, yearTo: event.target.value })}
                />
              </label>
            </div>
          </fieldset>
        </div>

        <div className="apply-bar">
          <button
            className="apply-button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            Show results
          </button>
        </div>
      </section>
    </div>
  )
}

export default function ShelfClient({ books }: { books: ShelfBook[] }) {
  const [sort, setSort] = useState<SortKey>('Date Added')
  const [reversed, setReversed] = useState(false)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [sheet, setSheet] = useState<'sort' | 'filter' | null>(null)
  const [friendsBook, setFriendsBook] = useState<ShelfBook | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  // The layout's inline script has already applied the theme; mirror it into state
  useEffect(() => {
    if (document.documentElement.dataset.theme === 'light') setTheme('light')
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
    setTheme(next)
  }

  const activeFilterCount =
    filters.genres.length +
    filters.shelves.length +
    Number(Boolean(filters.author)) +
    Number(Boolean(filters.yearFrom || filters.yearTo)) +
    Number(Boolean(filters.pagesFrom || filters.pagesTo)) +
    Number(Boolean(filters.rating))

  const authors = useMemo(
    () => [...new Set(books.map((book) => book.author))].sort((a, b) => a.localeCompare(b)),
    [books],
  )

  const visibleBooks = useMemo(() => {
    let result = books.filter((book) => {
      const authorMatches = book.author.toLowerCase().includes(filters.author.toLowerCase())
      const genresMatch =
        filters.genres.length === 0 || filters.genres.every((genre) => book.genres.includes(genre))
      const yearMatches =
        (!filters.yearFrom || (book.year ?? 0) >= Number(filters.yearFrom)) &&
        (!filters.yearTo || (book.year ?? Number.POSITIVE_INFINITY) <= Number(filters.yearTo))
      const pagesMatch =
        (!filters.pagesFrom || (book.pages ?? 0) >= Number(filters.pagesFrom)) &&
        (!filters.pagesTo || (book.pages ?? Number.POSITIVE_INFINITY) <= Number(filters.pagesTo))
      return authorMatches && genresMatch && yearMatches && pagesMatch && book.rating >= filters.rating
    })

    result = [...result].sort((a, b) => {
      if (sort === 'Title') return a.title.localeCompare(b.title)
      if (sort === 'Author') return a.author.localeCompare(b.author)
      if (sort === 'Average Rating') return b.rating - a.rating
      if (sort === 'Number of Ratings') return b.ratings - a.ratings
      if (sort === 'Publication Year') return (b.year ?? 0) - (a.year ?? 0)
      if (sort === 'Number of Pages') return (b.pages ?? 0) - (a.pages ?? 0)
      return b.addedAt - a.addedAt
    })
    return reversed ? result.reverse() : result
  }, [filters, reversed, sort])

  return (
    <main className="app">
      <section className="phone-shell">
        <header className="topbar">
          <button className="circle-button" aria-label="Go back">
            <Icon name="back" size={30} />
          </button>
          <h1>Want to Read</h1>
          <div className="menu-anchor">
            <button
              className="circle-button"
              aria-label="Shelf options"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name="more" size={28} />
            </button>
            {menuOpen && (
              <div className="quick-menu">
                <button
                  onClick={() => {
                    setSheet('sort')
                    setMenuOpen(false)
                  }}
                >
                  <Icon name="sort" size={19} /> Sort books
                </button>
                <button
                  onClick={() => {
                    setSheet('filter')
                    setMenuOpen(false)
                  }}
                >
                  <Icon name="filter" size={18} /> Filter shelf
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="controls">
          <button className="control-row filter-row" onClick={() => setSheet('filter')}>
            <span>
              <span className="label">Filtered by:</span>
              <strong>{activeFilterCount ? `${activeFilterCount} selected` : 'None'}</strong>
            </span>
            <span className="filter-icon">
              <Icon name="filter" size={21} />
              {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </span>
          </button>
          <div className="control-row">
            <button className="sort-trigger" onClick={() => setSheet('sort')}>
              <span className="label">Sorted by:</span>
              <strong>{sort}</strong>
            </button>
            <button className="reverse-button" onClick={() => setReversed((value) => !value)}>
              <Icon name="sort" size={20} />
              {reversed ? 'Forward' : 'Reverse'}
            </button>
          </div>
        </div>

        <section className="book-list" aria-live="polite">
          {visibleBooks.length ? (
            visibleBooks.map((book) => (
              <BookRow key={book.title} book={book} onOpenFriends={setFriendsBook} />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-book">WTR</div>
              <h2>No books found</h2>
              <p>Try clearing a filter to see more of your shelf.</p>
              <button onClick={() => setFilters(emptyFilters)}>Clear all filters</button>
            </div>
          )}
        </section>
      </section>

      <button
        className="theme-toggle"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      {sheet === 'sort' && (
        <SortSheet selected={sort} onSelect={setSort} onClose={() => setSheet(null)} />
      )}
      {sheet === 'filter' && (
        <FilterSheet
          initial={filters}
          authors={authors}
          onApply={setFilters}
          onClose={() => setSheet(null)}
        />
      )}
      {friendsBook && <FriendsSheet book={friendsBook} onClose={() => setFriendsBook(null)} />}
    </main>
  )
}
