## Setup Drizzle ORM with Bun SQL in an existing PostgreSQL project

### Prerequisites
- **dotenv** - for managing environment variables
- **bun** - JavaScript all-in-one toolkit
- **Bun SQL** - native bindings for PostgreSQL databases

### Important Note
Bun version 1.2.0 has issues with concurrent statement execution that may cause errors when running multiple queries simultaneously. This is tracked in a GitHub issue and should be resolved in future versions.

### Installation Steps

**Step 1: Install packages**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit @types/bun
```

**Step 2: Setup environment variables**
Create a `.env` file with `DATABASE_URL` pointing to your PostgreSQL database.

**Step 3: Setup Drizzle config**
Create a `drizzle.config.ts` file with dialect set to `postgresql` and reference the `DATABASE_URL` environment variable.

**Step 4: Introspect your database**
Run introspection to generate schema from existing PostgreSQL database.

**Step 5: Transfer introspected code**
Move the generated schema code to your actual schema file.

**Step 6: Connect Drizzle ORM to the database**
Setup the database connection using Bun SQL bindings.

**Step 7: Query the database**
Write queries using the Drizzle ORM API with Bun SQL dialect and `DATABASE_URL` environment variable.

**Step 8: Run the script**
```bash
bun src/index.ts
```

**Step 9 (Optional): Update table schema**
Modify your schema definitions as needed.

**Step 10 (Optional): Apply changes to database**
Run migrations to apply schema changes to the database.

**Step 11 (Optional): Query with new fields**
Test queries against the updated schema with new fields.