## Setup Drizzle with PGLite in Existing Project

1. Install `@electric-sql/pglite`
2. Set `DATABASE_URL` environment variable
3. Create drizzle.config.ts with PostgreSQL dialect
4. Introspect existing database to generate schema
5. Move introspected schema to schema file
6. Connect using PGLite driver
7. Query database with Drizzle ORM
8. Run with tsx
9. (Optional) Update schema, apply migrations, test new fields