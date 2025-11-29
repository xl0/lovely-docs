## Getting Started with Drizzle ORM and Supabase

This guide walks through setting up Drizzle ORM with a Supabase PostgreSQL database.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Supabase** - open source Firebase alternative

### Setup Steps

1. **Install postgres package** - Install the postgres driver for database connectivity

2. **Setup connection variables** - Configure DATABASE_URL environment variable with your Supabase connection string

3. **Connect Drizzle ORM to the database** - Initialize Drizzle connection using the postgres package and DATABASE_URL

4. **Create a table** - Define your database schema using Drizzle table definitions

5. **Setup Drizzle config file** - Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference

6. **Apply changes to the database** - Run migrations to create tables in Supabase

7. **Seed and Query the database** - Write TypeScript code to insert and query data using Drizzle ORM with postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file using tsx to test the setup

The guide includes file structure recommendations and uses environment variables for configuration.