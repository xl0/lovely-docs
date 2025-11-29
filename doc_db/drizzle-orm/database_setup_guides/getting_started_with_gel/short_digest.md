## Setup

Initialize Gel project, define schema in `dbschema/default.esdl`, create and apply migrations. Install `drizzle-orm gel` and `drizzle-kit tsx`.

## Configuration

Create `drizzle.config.ts` with `dialect: 'gel'`. Run `drizzle-kit pull` to generate schema types in `drizzle/schema.ts`.

## Connection & Operations

```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const db = drizzle({ client: createClient() });

// Insert
await db.insert(users).values({ name: "John", age: 30, email: "john@example.com" });

// Select
const allUsers = await db.select().from(users);

// Update
await db.update(users).set({ age: 31 }).where(eq(users.email, "john@example.com"));

// Delete
await db.delete(users).where(eq(users.email, "john@example.com"));
```

Run with `tsx src/index.ts`.