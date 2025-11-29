## Bun SQLite Setup

Install `drizzle-orm`, `drizzle-kit`, and `@types/bun`. Set `DB_FILE_NAME` environment variable. Connect using bun:sqlite, define tables, configure drizzle.config.ts with SQLite dialect, apply migrations, then seed/query with `bun src/index.ts`.