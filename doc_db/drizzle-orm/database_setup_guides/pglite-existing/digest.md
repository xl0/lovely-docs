## Setup Drizzle ORM with PGLite in an Existing Project

This guide walks through integrating Drizzle ORM with PGLite (ElectricSQL's PostgreSQL implementation) into an existing project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **ElectricSQL** - the organization behind PGLite
- **pglite driver** - the PostgreSQL implementation package

### Installation & Configuration Steps

**Step 1: Install packages**
Install `@electric-sql/pglite` along with Drizzle ORM.

**Step 2: Setup connection variables**
Configure `DATABASE_URL` environment variable for database connection.

**Step 3: Setup Drizzle config file**
Create drizzle.config.ts with PostgreSQL dialect and reference the `DATABASE_URL` environment variable.

**Step 4: Introspect your database**
Run introspection to automatically generate schema files from existing database structure.

**Step 5: Transfer code to schema file**
Move the introspected schema code into your actual schema file (typically `src/schema.ts`).

**Step 6: Connect Drizzle ORM to the database**
Establish connection using PGLite driver with the configured database URL.

**Step 7: Query the database**
Write and execute queries against the connected database using Drizzle ORM query builder.

**Step 8: Run index.ts file**
Execute your TypeScript file using tsx to test the setup.

**Step 9: Update table schema (optional)**
Modify table definitions in your schema file as needed.

**Step 10: Apply changes to database (optional)**
Run migrations to apply schema changes to the database.

**Step 11: Query with new fields (optional)**
Test queries using newly added schema fields.