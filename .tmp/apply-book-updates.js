// Paste into the browser console on your app's /admin page while logged in.
// Reuses covers already in Media (matched by alt text or file name), uploads any that are missing,
// then updates genres/pages/year/ratings/cover on each book. Safe to run more than once.
(async () => {
  const books = [
  {
    "id": "a06ffcc7-a561-4200-aa77-957b71c5ad69",
    "title": "down-the-drain",
    "data": {
      "publicationYear": 2023,
      "pageCount": 272,
      "genres": [
        "memoir",
        "biography",
        "non-fiction"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/14748770-L.jpg",
    "alt": "Down the Drain book cover",
    "coverName": "down-the-drain"
  },
  {
    "id": "24cb1bc9-4ef6-4100-b7ed-c110e8f86abe",
    "title": "funny-story",
    "data": {
      "publicationYear": 2024,
      "pageCount": 400,
      "genres": [
        "romance",
        "contemporary-fiction",
        "fiction",
        "humor"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/14625690-L.jpg",
    "alt": "Funny Story book cover",
    "coverName": "funny-story"
  },
  {
    "id": "88d903f0-3802-48f4-be54-d2e13f4e9360",
    "title": "the-secret-life-of-france",
    "data": {
      "publicationYear": 2009,
      "pageCount": 278,
      "genres": [
        "non-fiction",
        "travel",
        "history"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/10442737-L.jpg",
    "alt": "The Secret Life of France book cover",
    "coverName": "the-secret-life-of-france"
  },
  {
    "id": "8d5f8ced-7936-47de-86e4-512b9b6f8087",
    "title": "into-the-wild",
    "data": {
      "publicationYear": 1996,
      "pageCount": 207,
      "genres": [
        "non-fiction",
        "biography",
        "adventure",
        "travel",
        "nature"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/241290-L.jpg",
    "alt": "Into the Wild book cover",
    "coverName": "into-the-wild"
  },
  {
    "id": "fed40b44-1fcc-4cfb-b38d-7d8c4f6cb248",
    "title": "the-vanishing-half",
    "data": {
      "publicationYear": 2020,
      "pageCount": 352,
      "genres": [
        "historical-fiction",
        "literary-fiction",
        "fiction"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/10095692-L.jpg",
    "alt": "The Vanishing Half book cover",
    "coverName": "the-vanishing-half"
  },
  {
    "id": "fca4633a-4e5c-4b0b-957d-a9b3187cec0a",
    "title": "none-of-this-is-true",
    "data": {
      "publicationYear": 2023,
      "pageCount": 384,
      "genres": [
        "psychological-thriller",
        "thriller",
        "mystery",
        "crime"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/13300169-L.jpg",
    "alt": "None of This Is True book cover",
    "coverName": "none-of-this-is-true"
  },
  {
    "id": "b2e6427c-9e7e-47eb-bbd3-7823631a7e45",
    "title": "the-goldfinch",
    "data": {
      "publicationYear": 2013,
      "pageCount": 771,
      "genres": [
        "literary-fiction",
        "fiction",
        "coming-of-age"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/8771366-L.jpg",
    "alt": "The Goldfinch book cover",
    "coverName": "the-goldfinch"
  },
  {
    "id": "685dbb08-712f-4d7c-9985-c5f5ed3b2e10",
    "title": "the-covenant-of-water",
    "data": {
      "publicationYear": 2023,
      "pageCount": 715,
      "genres": [
        "historical-fiction",
        "literary-fiction",
        "fiction"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/13190092-L.jpg",
    "alt": "The Covenant of Water book cover",
    "coverName": "the-covenant-of-water"
  },
  {
    "id": "e5c4e4ad-5f4c-42f9-afa8-9df97f1b61f5",
    "title": "twenty-years-later",
    "data": {
      "publicationYear": 2021,
      "pageCount": 384,
      "genres": [
        "mystery",
        "thriller",
        "crime"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/12524317-L.jpg",
    "alt": "Twenty Years Later book cover",
    "coverName": "twenty-years-later"
  },
  {
    "id": "d2f9abb9-dcf2-4b17-8d44-3999ce331d5b",
    "title": "not-without-my-daughter",
    "data": {
      "publicationYear": 1987,
      "pageCount": 423,
      "genres": [
        "memoir",
        "biography",
        "non-fiction"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/8404282-L.jpg",
    "alt": "Not Without My Daughter book cover",
    "coverName": "not-without-my-daughter"
  },
  {
    "id": "c971e96c-addf-4e7d-a227-9de0a6ee5f06",
    "title": "sorrow-and-bliss",
    "data": {
      "publicationYear": 2020,
      "pageCount": 352,
      "genres": [
        "contemporary-fiction",
        "literary-fiction",
        "fiction",
        "humor"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/10658763-L.jpg",
    "alt": "Sorrow and Bliss book cover",
    "coverName": "sorrow-and-bliss"
  },
  {
    "id": "abf998d1-2699-4c06-bf6e-ed784f6d50df",
    "title": "migrations",
    "data": {
      "publicationYear": 2020,
      "pageCount": 272,
      "genres": [
        "literary-fiction",
        "fiction",
        "dystopian",
        "nature"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/9332728-L.jpg",
    "alt": "Migrations book cover",
    "coverName": "migrations"
  },
  {
    "id": "03c0ac01-1a55-4572-adec-083feff1457a",
    "title": "i-know-this-much-is-true",
    "data": {
      "publicationYear": 1998,
      "pageCount": 912,
      "genres": [
        "literary-fiction",
        "contemporary-fiction",
        "fiction"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/42828-L.jpg",
    "alt": "I Know This Much Is True book cover",
    "coverName": "i-know-this-much-is-true"
  },
  {
    "id": "1825fc47-1aa9-4b52-9dd1-59d5261aed31",
    "title": "a-clockwork-orange",
    "data": {
      "publicationYear": 1962,
      "pageCount": 224,
      "genres": [
        "classics",
        "science-fiction",
        "dystopian",
        "fiction"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/14430663-L.jpg",
    "alt": "A Clockwork Orange book cover",
    "coverName": "a-clockwork-orange"
  },
  {
    "id": "07919379-4df4-415c-a103-969f3824de39",
    "title": "the-new-jim-crow-mass-incarceration-in-the-age-of-colorblindness",
    "data": {
      "publicationYear": 2010,
      "pageCount": 290,
      "genres": [
        "non-fiction",
        "history",
        "politics"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/14826736-L.jpg",
    "alt": "The New Jim Crow: Mass Incarceration in the Age of Colorblindness book cover",
    "coverName": "the-new-jim-crow"
  },
  {
    "id": "ba44574e-3867-42e0-92ea-dd5954e8738a",
    "title": "hunger-a-memoir-of-my-body",
    "data": {
      "publicationYear": 2017,
      "pageCount": 306,
      "genres": [
        "memoir",
        "non-fiction",
        "lgbtq",
        "essays"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/8283872-L.jpg",
    "alt": "Hunger: A Memoir of (My) Body book cover",
    "coverName": "hunger"
  },
  {
    "id": "f64f7440-1737-4bfc-aec1-82f042fdb9e4",
    "title": "grief-is-for-people",
    "data": {
      "publicationYear": 2024,
      "pageCount": 208,
      "genres": [
        "memoir",
        "non-fiction",
        "essays"
      ],
      "ratingCount": 100000
    },
    "cover": "https://covers.openlibrary.org/b/id/14599795-L.jpg",
    "alt": "Grief Is for People book cover",
    "coverName": "grief-is-for-people"
  },
  {
    "id": "74e173ef-c242-4fa7-8643-4399193e7b45",
    "title": "carmilla",
    "data": {
      "genres": [
        "gothic",
        "horror",
        "classics",
        "paranormal",
        "lgbtq",
        "fiction"
      ]
    }
  },
  {
    "id": "2bab40b7-7446-441c-86c8-3b1d6a4ac640",
    "title": "yesteryear",
    "data": {
      "genres": [
        "literary-fiction",
        "fiction"
      ]
    }
  },
  {
    "id": "5fdcf70a-1946-4765-8e49-fd2e43d8bbb9",
    "title": "fight-club",
    "data": {
      "genres": [
        "fiction",
        "classics",
        "psychological-thriller",
        "literary-fiction"
      ]
    }
  },
  {
    "id": "a38f0331-1a08-4408-8eaf-6fa2ed7d29ca",
    "title": "martyr",
    "data": {
      "genres": [
        "literary-fiction",
        "fiction",
        "lgbtq"
      ]
    }
  },
  {
    "id": "6b7e253e-cdf2-495f-b84a-76b69bcab8f4",
    "title": "careless-people",
    "data": {
      "genres": [
        "memoir",
        "non-fiction",
        "business",
        "politics"
      ]
    }
  },
  {
    "id": "0ea3d8b7-ce2d-43e5-a73c-91167d90c815",
    "title": "all-fours",
    "data": {
      "genres": [
        "literary-fiction",
        "contemporary-fiction",
        "fiction",
        "humor",
        "lgbtq"
      ]
    }
  }
]

  const existing = (
    await fetch('/api/media?limit=500&depth=0', { credentials: 'include' }).then((res) => res.json())
  ).docs ?? []

  for (const book of books) {
    const data = { ...book.data }
    if (book.cover) {
      const match = existing.find(
        (media) =>
          (media.alt ?? '').toLowerCase() === book.alt.toLowerCase() ||
          (media.filename ?? '').toLowerCase().startsWith(book.coverName),
      )
      if (match) {
        data.cover = match.id
      } else {
      const image = await fetch(book.cover).then((res) => res.blob())
      const form = new FormData()
      form.append('file', image, `${book.title}.jpg`)
      form.append('_payload', JSON.stringify({ alt: book.alt }))
      const res = await fetch('/api/media', { method: 'POST', body: form, credentials: 'include' })
      const json = await res.json()
      if (!res.ok) { console.error('Cover upload failed:', book.title, json); continue }
      data.cover = json.doc.id
      }
    }
    const res = await fetch(`/api/books/${book.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    console.log(res.ok ? 'Updated' : 'FAILED', book.title, res.ok ? '' : await res.json())
  }
  console.log('Done')
})()
