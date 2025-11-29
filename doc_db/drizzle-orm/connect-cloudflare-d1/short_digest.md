## Cloudflare D1 Setup

D1 is Cloudflare's relational database with full Drizzle ORM support.

**Installation:** `drizzle-orm` and `drizzle-kit`

**Configuration:** Add D1 binding to `wrangler.json` or `wrangler.toml` with database name, ID, and migrations directory.

**Query:**
```typescript
import { drizzle } from 'drizzle-orm/d1';

const db = drizzle(env.BINDING_NAME);
const result = await db.select().from(users).all();
```