## Setup Drizzle with Xata (existing project)

1. Install postgres package
2. Set DATABASE_URL environment variable with Xata connection string
3. Create drizzle.config.ts with PostgreSQL dialect
4. Introspect existing database to generate schema
5. Move introspected schema to your schema file
6. Connect using postgres driver and connection string
7. Write and run queries
8. Optionally update schema and apply migrations