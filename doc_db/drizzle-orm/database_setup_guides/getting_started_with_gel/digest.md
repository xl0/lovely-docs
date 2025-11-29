## Setup and Installation

Initialize a Gel project and define a basic schema in `dbschema/default.esdl`:
```esdl
module default {
    type user {
        name: str;
        required email: str;
        age: int16;
    }
}
```

Create and apply Gel migrations:
```bash
gel migration create
gel migration apply
```

Install required packages:
```bash
npm install drizzle-orm gel
npm install -D drizzle-kit tsx
```

## Configuration

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
});
```

Pull the database schema to generate Drizzle types:
```bash
npx drizzle-kit pull
```

This generates `drizzle/schema.ts` with table definitions like:
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

## Database Connection

Create `src/index.ts` and initialize the connection:
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const gelClient = createClient();
const db = drizzle({ client: gelClient });
```

## Basic Operations

Insert, select, update, and delete records:
```typescript
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
import { users } from "../drizzle/schema";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

async function main() {
  const user: typeof users.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(users).values(user);
  const usersResponse = await db.select().from(users);
  
  await db
    .update(users)
    .set({ age: 31 })
    .where(eq(users.email, user.email));
  
  await db.delete(users).where(eq(users.email, user.email));
}

main();
```

Run with `tsx src/index.ts`.