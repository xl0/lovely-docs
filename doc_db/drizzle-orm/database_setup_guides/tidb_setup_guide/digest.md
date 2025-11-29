## Getting Started with TiDB

This guide walks through setting up Drizzle ORM with TiDB using HTTP connections via the `@tidbcloud/serverless` driver.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **TiDB** - PingCAP's Distributed SQL Database
- **@tidbcloud/serverless** - driver for HTTP external connections to TiDB

### Important Note
This tutorial uses `@tidbcloud/serverless` driver for HTTP calls. For TCP connections to TiDB, refer to the MySQL Get Started guide instead.

### Setup Steps

1. **Install @tidbcloud/serverless package** - Add the serverless driver dependency
2. **Setup connection variables** - Configure DATABASE_URL environment variable
3. **Connect Drizzle ORM to database** - Initialize Drizzle with TiDB connection
4. **Create a table** - Define schema using Drizzle
5. **Setup Drizzle config file** - Configure with mysql dialect and DATABASE_URL
6. **Apply changes to database** - Run migrations
7. **Seed and Query the database** - Populate and retrieve data using tidb-serverless dialect
8. **Run index.ts file** - Execute the TypeScript application

The guide follows a standard project structure and uses environment variables for database configuration.