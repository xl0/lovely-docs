## Vercel Postgres Integration

Vercel Postgres is a serverless SQL database designed to integrate with Vercel Functions. Drizzle ORM natively supports both the `@vercel/postgres` serverless driver via `drizzle-orm/vercel-postgres` package and traditional `postgres` or `pg` drivers for accessing Vercel Postgres through `postgresql://` connection strings.

### Installation

```
drizzle-orm @vercel/postgres
-D drizzle-kit
```

### Setup

1. Set up a Vercel Postgres project according to official Vercel documentation
2. Initialize the driver and execute queries

### Usage

**With @vercel/postgres (default):**
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';

const db = drizzle();
const result = await db.execute('select 1');
```

**With existing @vercel/postgres driver instance:**
```typescript
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

const db = drizzle({ client: sql });
const result = await db.execute('select 1');
```

### Key Features

- `@vercel/postgres` supports both serverful and serverless environments (including Cloudflare Workers) via websockets when TCP is unavailable
- For serverful environments, you can use either `@vercel/postgres` or direct `postgresql://` access with `postgres` or `pg` drivers
- No configuration needed for default usage - `drizzle()` automatically connects using environment variables