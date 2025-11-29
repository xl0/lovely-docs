## Setup Drizzle ORM with Neon in an existing project

This guide walks through integrating Drizzle ORM with a Neon serverless PostgreSQL database in an existing project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Neon** - serverless Postgres platform

### Installation & Configuration Steps

1. **Install @neondatabase/serverless package** - the Neon driver for Drizzle
2. **Setup connection variables** - configure DATABASE_URL environment variable with your Neon connection string
3. **Setup Drizzle config file** - create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference
4. **Introspect your database** - use `drizzle-kit introspect:pg` to generate schema from existing database tables
5. **Transfer code to schema file** - move the introspected schema to your actual schema file (typically src/schema.ts)
6. **Connect Drizzle ORM to database** - initialize Drizzle client using Neon's HTTP driver with your DATABASE_URL
7. **Query the database** - write and execute queries using Drizzle's query builder
8. **Run index.ts file** - execute your TypeScript file with tsx to test the connection and queries
9. **Update table schema (optional)** - modify your schema.ts file to add new columns or tables
10. **Apply changes to database (optional)** - run migrations with `drizzle-kit push:pg` to update the database
11. **Query with new fields (optional)** - update queries to use newly added schema fields

The workflow follows: install driver → configure environment → introspect existing schema → connect client → query → optionally modify schema and apply changes.