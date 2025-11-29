## Setup Drizzle ORM with Gel in an existing project

**Prerequisites:**
- tsx package for running TypeScript files
- gel-js package for querying Gel database

**Step 1: Install packages**
```
npm install drizzle-orm gel
npm install -D drizzle-kit tsx
```

**Step 2: Create drizzle.config.ts**
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
});
```

**Step 3: Pull database schema**
Run `npx drizzle-kit pull` to generate schema from your Gel database. This creates a schema.ts file with table definitions using gelTable, uuid, smallint, text, and other Gel-specific types.

Example generated schema:
```typescript
import { gelTable, uniqueIndex, uuid, smallint, text } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const users = gelTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	age: smallint(),
	email: text().notNull(),
	name: text(),
}, (table) => [
	uniqueIndex("a8c6061c-f37f-11ef-9249-0d78f6c1807b;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
```

**Step 4: Initialize database connection**
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const gelClient = createClient();
const db = drizzle({ client: gelClient });
```

**Step 5: Query the database**
```typescript
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
import { users } from "../drizzle/schema";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

async function main() {
  const user = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(users).values(user);
  console.log("New user created!");

  const usersResponse = await db.select().from(users);
  console.log("Getting all users from the database: ", usersResponse);

  await db
    .update(users)
    .set({ age: 31 })
    .where(eq(users.email, user.email));
  console.log("User info updated!");

  await db.delete(users).where(eq(users.email, user.email));
  console.log("User deleted!");
}

main();
```

**Step 6: Run the file**
Execute with tsx: `npx tsx src/index.ts`