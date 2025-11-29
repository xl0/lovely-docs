Step-by-step guide to integrate Drizzle ORM into an existing PostgreSQL project.

**Prerequisites:**
- dotenv: manage environment variables
- tsx: run TypeScript files
- node-postgres: query PostgreSQL database

**Setup Steps:**

1. Install node-postgres package and its TypeScript types:
   ```
   npm install pg
   npm install -D @types/pg
   ```

2. Configure DATABASE_URL environment variable in .env file

3. Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference

4. Run introspection to generate schema from existing database:
   ```
   drizzle-kit introspect:pg
   ```

5. Transfer introspected schema code to your actual schema file (typically src/schema.ts)

6. Connect Drizzle ORM to database using node-postgres driver with DATABASE_URL

7. Query the database using Drizzle ORM methods

8. Execute index.ts file to test queries

9. (Optional) Update table schema definitions as needed

10. (Optional) Apply schema changes to database using migrations

11. (Optional) Query database with newly added fields

**Key Files:**
- drizzle.config.ts: Drizzle configuration
- src/schema.ts: Generated/updated database schema
- .env: Environment variables including DATABASE_URL
- index.ts: Application entry point with queries

**Note:** If PostgreSQL database doesn't exist, setup guide available for PostgreSQL in Docker with database URL generation instructions.