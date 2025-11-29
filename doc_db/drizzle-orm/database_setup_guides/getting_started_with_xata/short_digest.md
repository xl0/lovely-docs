## Setup Drizzle with Xata

1. Install postgres package
2. Set DATABASE_URL environment variable with Xata connection string
3. Connect Drizzle to database using postgres driver
4. Define tables in schema
5. Create drizzle.config.ts with postgresql dialect and DATABASE_URL
6. Run `drizzle-kit push:pg` to apply changes
7. Seed and query database using Drizzle ORM
8. Execute with tsx