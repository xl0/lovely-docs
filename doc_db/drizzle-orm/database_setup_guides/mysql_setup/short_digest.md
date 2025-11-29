## MySQL Setup

**Prerequisites:** dotenv, tsx, mysql2

**Steps:**
1. Install mysql2 package
2. Set DATABASE_URL environment variable
3. Connect Drizzle to database with mysql2 driver
4. Define table schema
5. Create drizzle.config.ts with dialect='mysql'
6. Run migrations
7. Seed and query database
8. Execute TypeScript file

Use `drizzle-orm/mysql2` for native support.