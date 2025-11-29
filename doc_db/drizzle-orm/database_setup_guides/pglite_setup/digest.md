## Getting Started with PGlite

This guide walks through setting up Drizzle ORM with PGlite, a PostgreSQL database that runs in-process.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **ElectricSQL** - the organization behind PGlite
- **pglite driver** - the PostgreSQL driver for PGlite

### Setup Steps

1. **Install packages**: Install `@electric-sql/pglite` along with Drizzle ORM
2. **Setup connection variables**: Configure `DATABASE_URL` environment variable
3. **Connect to database**: Initialize Drizzle ORM connection to PGlite
4. **Create a table**: Define your database schema using Drizzle ORM table definitions
5. **Setup Drizzle config file**: Create `drizzle.config.ts` with PostgreSQL dialect and `DATABASE_URL` reference
6. **Apply migrations**: Run Drizzle migrations to create tables in the database
7. **Seed and query**: Write TypeScript code to insert data and query the database using PGlite dialect
8. **Run the file**: Execute the TypeScript file using tsx

The guide includes file structure setup and covers the complete workflow from installation through querying the database.