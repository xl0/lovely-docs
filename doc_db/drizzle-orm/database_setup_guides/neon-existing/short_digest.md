## Setup Drizzle with Neon in existing project

1. Install `@neondatabase/serverless` package
2. Set `DATABASE_URL` environment variable
3. Create drizzle.config.ts with PostgreSQL dialect
4. Run `drizzle-kit introspect:pg` to generate schema from existing tables
5. Move introspected schema to src/schema.ts
6. Initialize Drizzle client with Neon HTTP driver
7. Write and execute queries
8. Optionally: modify schema, run `drizzle-kit push:pg`, and query new fields