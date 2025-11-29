## Setup Drizzle with Supabase in Existing Project

1. Install postgres package
2. Set DATABASE_URL environment variable
3. Create drizzle.config.ts with PostgreSQL dialect
4. Introspect existing Supabase database to generate schema
5. Move introspected schema to schema file
6. Connect Drizzle client using postgres driver
7. Write and run queries
8. Optionally update schema and apply migrations