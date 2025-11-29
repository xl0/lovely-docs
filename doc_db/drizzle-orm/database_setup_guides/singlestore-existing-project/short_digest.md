## Setup Drizzle with SingleStore in Existing Project

**Prerequisites:** dotenv, tsx, mysql2

**Steps:**
1. Install mysql2 package
2. Set DATABASE_URL environment variable
3. Create drizzle.config.ts with singlestore dialect
4. Introspect existing database to generate schema
5. Transfer introspected schema to schema file
6. Connect Drizzle client with mysql2
7. Query database with Drizzle ORM
8. Run with tsx
9. (Optional) Update schema and apply migrations