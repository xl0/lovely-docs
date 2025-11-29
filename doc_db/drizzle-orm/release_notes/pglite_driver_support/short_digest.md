## PGlite Driver Support

WASM-based Postgres for browsers, Node.js, and Bun (2.6mb gzipped). Supports in-memory or persistent storage (file system/indexedDB).

```ts
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const db = drizzle(new PGlite());
await db.select().from(users);
```