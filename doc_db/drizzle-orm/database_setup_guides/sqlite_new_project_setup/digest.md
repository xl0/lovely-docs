## SQLite New Project Setup with Drizzle ORM

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- libsql - a SQLite fork optimized for low query latency

**Supported Drivers:**
Drizzle has native support for SQLite with `libsql` and `better-sqlite3` drivers. This guide uses `libsql`.

**Step 1: Install Packages**
Install `@libsql/client` package.

**Step 2: Setup Connection Variables**
Set `DB_FILE_NAME` environment variable. For local SQLite database files, use the format `file:local.db` as required by LibSQL.

**Step 3: Connect Drizzle ORM**
Create a connection using the libsql driver with the database file path from environment variables.

**Step 4: Create a Table**
Define your database schema using Drizzle's table definition syntax.

**Step 5: Setup Drizzle Config File**
Create a drizzle.config file with SQLite dialect and reference the `DB_FILE_NAME` environment variable.

**Step 6: Apply Changes to Database**
Run migrations to apply schema changes to the database.

**Step 7: Seed and Query Database**
Write and execute queries using the libsql driver to insert and retrieve data.

**Step 8: Run TypeScript File**
Execute the index.ts file using tsx to test your setup.