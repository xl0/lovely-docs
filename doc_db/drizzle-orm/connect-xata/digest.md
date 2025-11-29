## Xata Integration

Xata is a PostgreSQL database platform with features like instant copy-on-write database branches, zero-downtime schema changes, data anonymization, AI-powered performance monitoring, and BYOC.

### Installation

Install required packages:
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Setup

Initialize the driver with your Xata database URL:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

### Using Existing Driver

If you have an existing postgres driver instance, pass it to drizzle:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

Xata uses the standard PostgreSQL driver, so all PostgreSQL documentation applies. See official Xata + Drizzle documentation for additional details.