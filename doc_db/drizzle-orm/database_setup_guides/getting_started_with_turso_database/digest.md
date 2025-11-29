## Setup and Installation

Install required packages:
```
drizzle-orm@beta @tursodatabase/database dotenv
-D drizzle-kit@beta tsx
```

Set environment variable `DB_FILE_NAME` (e.g., `mydb.sqlite`) for your database file location.

## Database Connection

Connect to Turso Database using drizzle:
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle();
```

## Schema Definition

Create tables using Drizzle schema (see CreateTable component for details).

## Configuration

Setup `drizzle.config.ts` with SQLite dialect and `DB_FILE_NAME` environment variable.

## Database Operations

Apply migrations to the database using Drizzle Kit.

Perform CRUD operations:
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

Run TypeScript files using `tsx` package.