## Setup Drizzle ORM with SingleStore in an Existing Project

This guide walks through integrating Drizzle ORM into an existing project that uses SingleStore database.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - MySQL driver for querying SingleStore database

### Setup Steps

1. **Install mysql2 package** - Required driver for SingleStore connections

2. **Setup connection variables** - Configure `DATABASE_URL` environment variable with your SingleStore connection string

3. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'singlestore' and reference the DATABASE_URL environment variable

4. **Introspect your database** - Run introspection to automatically generate schema definitions from existing SingleStore database tables

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Initialize Drizzle client with mysql2 connection and pass your schema

7. **Query the database** - Write and execute queries using Drizzle ORM against SingleStore

8. **Run index.ts file** - Execute your TypeScript file with tsx to test the setup

9. **Update table schema (optional)** - Modify schema definitions as needed

10. **Apply changes to database (optional)** - Use migrations to apply schema changes to SingleStore

11. **Query with new fields (optional)** - Test queries with updated schema fields