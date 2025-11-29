## Setup Drizzle ORM with Xata in an existing project

This guide walks through integrating Drizzle ORM with an existing Xata PostgreSQL database.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Xata Postgres database

**Setup Steps:**

1. **Install postgres package** - Add the postgres driver package to your project

2. **Setup connection variables** - Create a DATABASE_URL environment variable with your Xata connection string (obtainable from Xata documentation)

3. **Setup Drizzle config file** - Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference

4. **Introspect your database** - Run introspection to generate schema files from your existing database structure

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Set up the database connection using the postgres driver and your connection string

7. **Query the database** - Write and execute queries using Drizzle ORM with postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file to test the setup

9. **Update table schema (optional)** - Modify your table definitions as needed

10. **Apply changes to database (optional)** - Run migrations to apply schema changes to your Xata database

11. **Query with new fields (optional)** - Test queries with newly added fields