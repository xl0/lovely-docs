## Connecting Drizzle to Supabase

Supabase is an open source Firebase alternative for building secure and performant Postgres backends with minimal configuration.

### Installation

Install required packages:
```
drizzle-orm postgres
-D drizzle-kit
```

### Basic Connection

Initialize the driver with your database URL:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

### Using Existing Driver

Provide your own postgres client instance:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

### Connection Pooling Configuration

When using Supabase's Connection Pooler in "Transaction" pool mode, disable prepared statements since they are not supported:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL, { prepare: false })
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

Use the Connection Pooler for serverless environments and the Direct Connection for long-running servers.