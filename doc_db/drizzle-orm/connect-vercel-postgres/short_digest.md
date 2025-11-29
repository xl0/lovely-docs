## Vercel Postgres Integration

Install `drizzle-orm @vercel/postgres` and `-D drizzle-kit`.

**Basic usage:**
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
const result = await db.execute('select 1');
```

**With existing driver:**
```typescript
import { sql } from '@vercel/postgres';
const db = drizzle({ client: sql });
```

Supports serverless environments via websockets and serverful environments via TCP or `postgresql://` with `postgres`/`pg` drivers.