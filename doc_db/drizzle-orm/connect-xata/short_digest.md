## Xata Integration

PostgreSQL platform with branches, zero-downtime migrations, and performance monitoring.

**Install:** `npm install drizzle-orm postgres` and `npm install -D drizzle-kit`

**Setup:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
const db = drizzle(process.env.DATABASE_URL);
```

Or with existing driver:
```typescript
import postgres from 'postgres'
const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
```