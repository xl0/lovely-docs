## Bun SQL Integration

Install `drizzle-orm` and `drizzle-kit`. Initialize with:
```typescript
import { drizzle } from 'drizzle-orm/bun-sql';
const db = drizzle(process.env.DATABASE_URL);
```

Or with existing driver:
```typescript
import { SQL } from 'bun';
const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });
```