## PostgreSQL New Project Setup

Complete walkthrough for initializing a new Drizzle ORM project with PostgreSQL using node-postgres driver.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file execution
- **node-postgres** - PostgreSQL database querying

### Setup Steps

**Step 1: Install Dependencies**
Install `pg` package and `@types/pg` dev dependency for PostgreSQL support.

**Step 2: Configure Connection Variables**
Set up `DATABASE_URL` environment variable containing your PostgreSQL connection string.

**Step 3: Connect Drizzle to Database**
Initialize Drizzle ORM connection using node-postgres driver with your database URL.

**Step 4: Define Tables**
Create database schema by defining table structures using Drizzle's table definition API.

**Step 5: Setup Drizzle Config**
Create `drizzle.config.ts` configuration file specifying PostgreSQL dialect and DATABASE_URL environment variable.

**Step 6: Apply Database Changes**
Run migrations to apply schema changes to your PostgreSQL database.

**Step 7: Seed and Query Database**
Write and execute TypeScript code to insert seed data and query the database using Drizzle ORM.

**Step 8: Execute Application**
Run the `index.ts` file to test your setup.

### Additional Resources
- Drizzle supports both `node-postgres` and `postgres.js` drivers for PostgreSQL
- For local PostgreSQL setup, use Docker with the provided PostgreSQL local setup guide
- Alternative PostgreSQL connection methods available in dedicated connection documentation