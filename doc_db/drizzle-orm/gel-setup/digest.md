## Gel Integration Setup

Drizzle provides native support for Gel database connections through the `gel-js` client.

### Prerequisites
- Database connection basics with Drizzle
- gel-js basics

### Installation
Install `drizzle-orm`, `gel`, and `drizzle-kit` as dev dependency.

### Driver Initialization

**Basic initialization with connection string:**
```typescript
import { drizzle } from 'drizzle-orm/gel';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from "drizzle-orm/gel";
const db = drizzle({
  connection: {
    dsn: process.env.DATABASE_URL,
    tlsSecurity: "default",
  },
});
const result = await db.execute("select 1");
```

**With existing Gel client:**
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
const gelClient = createClient();
const db = drizzle({ client: gelClient });
const result = await db.execute('select 1');
```

All three approaches support executing raw SQL queries via `db.execute()`.