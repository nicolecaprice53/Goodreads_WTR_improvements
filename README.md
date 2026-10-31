# Goodreads_WTR_improvements
Adding filtering by genre, rating, pages, etc. and improved social features on the Want to Read shelf

Public Figma site: https://novel-fit-82844753.figma.site

## Repositories

This project lives in two Git remotes:

- **GitHub** (`nicolecaprice53/Goodreads_WTR_improvements`) is the upstream development repository.
- **Figma Make** keeps its own managed `origin` for the Make file. Don't replace or repoint it.

To bring GitHub changes into Figma Make, fetch and merge them. Don't overwrite Figma's origin:

```sh
git fetch <github-remote>
git merge <github-remote>/main
```

App data (books, covers, friend ratings) lives in the Figma-managed Payload database, not in Git. Rolling back code doesn't roll back data.

## Images and Git LFS

`.gitattributes` tracks images (`*.jpg`, `*.png`, …) with Git LFS. Before cloning or pulling, run:

```sh
git lfs install
git lfs pull
```

The app shows covers and profile photos from Payload Media. The files in `public/covers/` and `public/avatars/` are local source copies.

