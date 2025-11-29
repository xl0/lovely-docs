## PostgreSQL New Project Setup

8-step initialization guide for Drizzle ORM with PostgreSQL:

1. Install `pg` and `@types/pg`
2. Set `DATABASE_URL` environment variable
3. Connect Drizzle using node-postgres driver
4. Define table schemas
5. Create `drizzle.config.ts` with PostgreSQL dialect
6. Run migrations
7. Seed and query database with TypeScript
8. Execute `index.ts`

Supports both node-postgres and postgres.js drivers. Docker setup available for local PostgreSQL.