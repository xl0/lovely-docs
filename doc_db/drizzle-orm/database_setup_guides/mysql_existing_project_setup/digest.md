## Setup Drizzle ORM with MySQL in an Existing Project

This guide walks through integrating Drizzle ORM into an existing MySQL project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - for querying MySQL database

### Step-by-Step Process

1. **Install mysql2 package** - Required driver for MySQL connections

2. **Setup connection variables** - Configure DATABASE_URL environment variable in .env file

3. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'mysql' and reference the DATABASE_URL environment variable

4. **Introspect your database** - Use Drizzle's introspection tool to analyze your existing MySQL database schema

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Establish connection using mysql2 driver with the DATABASE_URL

7. **Query the database** - Write and execute queries using Drizzle ORM with mysql2 dialect

8. **Run index.ts file** - Execute your TypeScript file using tsx

9. **Update table schema (optional)** - Modify existing table definitions as needed

10. **Apply changes to database (optional)** - Use migrations to apply schema changes to the database

11. **Query database with new field (optional)** - Test queries against updated schema with new columns