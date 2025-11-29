## Getting Started with Drizzle ORM and PlanetScale

This guide walks through setting up Drizzle ORM with PlanetScale, a MySQL database platform, using the HTTP-based `database-js` driver for serverless connections.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **PlanetScale** - MySQL database platform
- **database-js** - PlanetScale serverless driver for HTTP calls

### Important Note
This tutorial uses the `database-js` driver for HTTP calls to PlanetScale. For TCP connections to PlanetScale, refer to the MySQL setup guide instead.

### Setup Steps

1. **Install @planetscale/database package** - Add the PlanetScale database driver to your project

2. **Setup connection variables** - Create a `.env` file with:
   ```
   DATABASE_HOST=
   DATABASE_USERNAME=
   DATABASE_PASSWORD=
   ```
   Get these values from PlanetScale's serverless driver documentation

3. **Connect Drizzle ORM to the database** - Configure the connection using the environment variables

4. **Create a table** - Define your database schema

5. **Setup Drizzle config file** - Configure Drizzle with MySQL dialect and DATABASE_URL environment variable

6. **Apply changes to the database** - Run migrations to create tables

7. **Seed and Query the database** - Populate and retrieve data

8. **Run index.ts file** - Execute your TypeScript application