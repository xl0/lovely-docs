## Setup Drizzle ORM with SQLite in an Existing Project

This guide walks through integrating Drizzle ORM into an existing SQLite database project using LibSQL client.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **libsql** - SQLite fork optimized for low query latency

### Installation & Configuration

**Step 1: Install packages**
Install `@libsql/client` package.

**Step 2: Setup connection variables**
Create environment variable `DB_FILE_NAME` with LibSQL format. For local SQLite files, prefix with `file:`:
```
DB_FILE_NAME=file:local.db
```

**Step 3: Setup Drizzle config file**
Configure Drizzle with SQLite dialect and reference the `DB_FILE_NAME` environment variable.

### Database Integration

**Step 4: Introspect your database**
Run introspection to analyze existing SQLite database schema.

**Step 5: Transfer code to schema file**
Move introspected schema code to your actual schema file.

**Step 6: Connect Drizzle ORM to database**
Establish connection using LibSQL client with the configured database file.

**Step 7: Query the database**
Execute queries against the database using Drizzle ORM with LibSQL dialect.

**Step 8: Run index.ts file**
Execute the TypeScript file to verify setup.

### Optional: Schema Updates

**Step 9: Update table schema**
Modify table definitions as needed.

**Step 9 (alt): Apply changes to database**
Apply schema changes to the database.

**Step 10: Query with new fields**
Execute queries using updated schema with new fields.