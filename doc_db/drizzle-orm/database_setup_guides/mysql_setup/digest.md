## MySQL Setup with Drizzle ORM

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- mysql2 - MySQL client for Node.js with performance focus

**Driver:** Use `mysql2` driver with `drizzle-orm/mysql2` package for native support.

**Setup Steps:**

1. **Install mysql2 package** - Add the MySQL client dependency to your project

2. **Setup connection variables** - Configure DATABASE_URL environment variable with your MySQL connection string

3. **Connect Drizzle ORM to database** - Initialize Drizzle connection using the mysql2 driver and DATABASE_URL

4. **Create a table** - Define your database schema using Drizzle table definitions

5. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'mysql' and DATABASE_URL reference

6. **Apply changes to database** - Run migrations to create tables in your MySQL database

7. **Seed and Query the database** - Insert test data and execute queries using Drizzle ORM with mysql2 driver

8. **Run index.ts file** - Execute your TypeScript application file

**Note:** If you don't have a MySQL database yet, you can set up MySQL in Docker using the provided guide to generate a database URL.