## Getting Started with Drizzle ORM and SingleStore

This guide walks through setting up Drizzle ORM with a SingleStore database using the `mysql2` driver.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - MySQL client for Node.js with performance focus

### Setup Steps

**Step 1: Install mysql2 package**
Install the mysql2 package which Drizzle ORM natively supports via the `drizzle-orm/singlestore` package.

**Step 2: Setup connection variables**
Configure DATABASE_URL environment variable for database connection.

**Step 3: Connect Drizzle ORM to the database**
Initialize Drizzle ORM connection using the SingleStore driver with mysql2.

**Step 4: Create a table**
Define your database schema using Drizzle ORM's table definition API for SingleStore.

**Step 5: Setup Drizzle config file**
Create drizzle.config.ts with dialect set to 'singlestore' and DATABASE_URL environment variable reference.

**Step 6: Applying changes to the database**
Run migrations to apply schema changes to your SingleStore database.

**Step 7: Seed and Query the database**
Insert seed data and execute queries against the SingleStore database using Drizzle ORM.

**Step 8: Run index.ts file**
Execute your TypeScript application file to test the setup.

### Key Points
- Drizzle ORM natively supports mysql2 driver for SingleStore databases
- The `drizzle-orm/singlestore` package provides SingleStore-specific functionality
- Configuration uses standard environment variables and config file pattern