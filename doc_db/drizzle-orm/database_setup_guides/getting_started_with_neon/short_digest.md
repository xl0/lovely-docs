## Setup Drizzle with Neon

Install `@neondatabase/serverless`, set `DATABASE_URL` env variable, connect Drizzle using the Neon driver, define schema, create `drizzle.config.ts` with `dialect: 'postgresql'`, run migrations, seed/query database, and execute with tsx.

**Drivers:** `neon-http` for single transactions over HTTP, `neon-websockets` for interactive transactions, `neon-serverless` as full `pg` replacement.