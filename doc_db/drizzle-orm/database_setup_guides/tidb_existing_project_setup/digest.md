## Setup Drizzle ORM with TiDB in an Existing Project

This guide walks through integrating Drizzle ORM with TiDB (PingCAP's Distributed SQL Database) into an existing project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **TiDB** - the distributed SQL database
- **@tidbcloud/serverless** - for serverless and edge compute platforms requiring HTTP external connections

### Step-by-Step Setup

1. **Install @tidbcloud/serverless package** - Add the TiDB serverless driver to your project

2. **Setup connection variables** - Configure DATABASE_URL environment variable for database connection

3. **Setup Drizzle config file** - Create drizzle.config with MySQL dialect and DATABASE_URL reference

4. **Introspect your database** - Use Drizzle's introspection to analyze existing TiDB database schema

5. **Transfer code to schema file** - Move introspected schema definitions to your actual schema file

6. **Connect Drizzle ORM to database** - Establish connection using @tidbcloud/serverless driver

7. **Query the database** - Execute queries against TiDB using Drizzle ORM with tidb-serverless dialect and DATABASE_URL

8. **Run index.ts file** - Execute your TypeScript application file

9. **Update table schema (optional)** - Modify existing table definitions as needed

10. **Apply changes to database (optional)** - Migrate schema changes to TiDB

11. **Query database with new field (optional)** - Test queries with newly added schema fields

The guide covers both initial setup and optional schema modifications for existing projects.