## Setup Drizzle ORM with Neon Serverless Postgres

Drizzle ORM provides native support for Neon connections using `neon-http` and `neon-websockets` drivers, which use the neon-serverless driver under the hood.

**Driver Selection:**
- `neon-http`: Query over HTTP, faster for single non-interactive transactions, suitable for serverless environments
- `neon-websockets`: WebSocket-based driver for session and interactive transaction support
- `neon-serverless`: Full drop-in replacement for the `pg` driver with WebSocket support
- For direct Postgres connections, use the standard PostgreSQL setup instead

**Setup Steps:**

1. Install the `@neondatabase/serverless` package
2. Set up `DATABASE_URL` environment variable with your Neon connection string
3. Connect Drizzle ORM to the database using the Neon driver
4. Define your database schema with tables
5. Create and configure a `drizzle.config.ts` file with `dialect: 'postgresql'` and your `DATABASE_URL`
6. Run migrations to apply schema changes to the database
7. Seed the database and write queries using Drizzle ORM
8. Execute your TypeScript files using tsx

**Prerequisites:** dotenv package for environment variables, tsx for running TypeScript, and a Neon account with serverless Postgres platform access.