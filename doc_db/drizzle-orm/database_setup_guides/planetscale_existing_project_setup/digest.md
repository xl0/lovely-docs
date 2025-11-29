## Setup Drizzle ORM with PlanetScale in an Existing Project

This guide covers integrating Drizzle ORM with PlanetScale (MySQL database platform) using the `database-js` serverless driver for HTTP connections.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file execution
- **PlanetScale** - MySQL database platform
- **database-js** - PlanetScale serverless driver

### Important Note
This tutorial uses the `database-js` driver for HTTP calls to PlanetScale. For TCP connections, refer to the MySQL Get Started guide instead.

### Setup Steps

1. **Install Package**: Install `@planetscale/database`

2. **Setup Connection Variables**: Configure `DATABASE_URL` environment variable

3. **Setup Drizzle Config**: Create drizzle config file with MySQL dialect and `DATABASE_URL` reference

4. **Introspect Database**: Run introspection to generate schema from existing database

5. **Transfer Code**: Move introspected schema to actual schema file

6. **Connect Drizzle ORM**: Initialize Drizzle with PlanetScale connection using host, username, and password from environment

7. **Query Database**: Execute queries against the database

8. **Run Application**: Execute the index.ts file

### Optional Schema Updates

9. **Update Table Schema**: Modify table definitions (e.g., add new fields like `phone`)

10. **Apply Changes**: Run migrations to update database schema

11. **Query with New Fields**: Execute queries using updated schema

### Example - Full CRUD Operations
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle({ connection: {
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
    }});

  // Create
  const user = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
    phone: '123-456-7890',
  };
  await db.insert(usersTable).values(user);

  // Read
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```