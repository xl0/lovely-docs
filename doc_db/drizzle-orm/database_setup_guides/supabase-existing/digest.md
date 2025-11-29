## Setup Drizzle ORM with Supabase in an Existing Project

This guide walks through integrating Drizzle ORM into an existing project that uses Supabase (PostgreSQL).

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Supabase** - open source Firebase alternative

### Step-by-Step Setup

**Step 1: Install postgres package**
Install the postgres driver package for database connectivity.

**Step 2: Setup connection variables**
Configure DATABASE_URL environment variable with your Supabase connection string.

**Step 3: Setup Drizzle config file**
Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference.

**Step 4: Introspect your database**
Run introspection to automatically generate schema definitions from your existing Supabase database tables.

**Step 5: Transfer code to schema file**
Move the introspected schema code into your actual schema file (typically src/schema.ts or similar).

**Step 6: Connect Drizzle ORM to the database**
Initialize Drizzle client with postgres connection using DATABASE_URL.

**Step 7: Query the database**
Write and execute queries using Drizzle ORM against your Supabase database.

**Step 8: Run index.ts file**
Execute your TypeScript file using tsx to test the setup.

**Step 9: Update table schema (optional)**
Modify table definitions in your schema file as needed.

**Step 10: Apply changes to database (optional)**
Use Drizzle migrations to push schema changes to Supabase.

**Step 11: Query database with new field (optional)**
Test queries with newly added schema fields.