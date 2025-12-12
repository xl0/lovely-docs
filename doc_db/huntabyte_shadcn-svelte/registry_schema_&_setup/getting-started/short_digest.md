## Setup

Create `registry.json` in project root with schema reference, name, homepage, and items array.

## Create and register components

Place components in `registry/[NAME]/` structure. Add to `registry.json` with required fields: `name`, `type`, `title`, `description`, `files` (with `path` and `type` for each file).

## Build and serve

Install CLI (`npm i shadcn-svelte@latest`), add `registry:build` script, run it to generate JSON files in `static/r/`. Serve with dev server at `http://localhost:5173/r/[NAME].json`.

## Publish and auth

Deploy to public URL. For auth, use token query parameter and return 401 for invalid tokens on server side.

## Guidelines

List registry dependencies in `registryDependencies`. Organize files in `components`, `hooks`, or `lib` directories.