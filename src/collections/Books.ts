import { revalidateTag } from 'next/cache'
import type { Access, CollectionConfig } from 'payload'

import { BOOK_GENRES } from '../lib/genres'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Books: CollectionConfig = {
  slug: 'books',
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: () => true,
    update: isPayloadAdmin,
  },
  admin: {
    defaultColumns: ['title', 'author', 'averageRating', 'dateAdded'],
    group: 'Want to Read',
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag('books', 'max')
      },
    ],
    afterDelete: [
      () => {
        revalidateTag('books', 'max')
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'averageRating',
      type: 'number',
      required: true,
      min: 0,
      max: 5,
    },
    {
      name: 'ratingCount',
      type: 'number',
      min: 0,
    },
    {
      name: 'publicationYear',
      type: 'number',
      min: 0,
      max: 3000,
    },
    {
      name: 'pageCount',
      type: 'number',
      min: 1,
    },
    {
      name: 'dateAdded',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'MMM d, yyyy',
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'position',
      type: 'number',
      min: 1,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'genres',
      type: 'select',
      hasMany: true,
      options: BOOK_GENRES.map(([value, label]) => ({ label, value })),
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'friendRatings',
      type: 'array',
      labels: {
        singular: 'Friend rating',
        plural: 'Friend ratings',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 4,
          max: 5,
        },
        {
          name: 'profilePhoto',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'review',
          type: 'textarea',
        },
      ],
    },
  ],
  versions: false,
}
