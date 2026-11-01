# Pending Payload data changes 11/1 3pm

Apply these with the Payload data tooling, in this order:

1. **`genre-edits.json`**: set `genres` on Fight Club and None of This Is True. This removes `psychological-thriller`, which the code no longer allows.
2. **`goodreads-rating-counts.json`**: set `ratingCount` on 17 books. Their current value is the placeholder 100,000.
3. **`david-joyner-books.json`**: create 7 books.
   - Upload `public/avatars/david-joyner.jpg` to Media once. Set it as `profilePhoto` on each book's David Joyner friend rating.
   - Upload each book's `cover` file from `public/covers/` to Media and link it. Artifact has no cover (`null`).

Each step changes Payload documents, not code. Delete this folder once they're applied.
