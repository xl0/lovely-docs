## PGlite Driver Support

PGlite is a WASM-based Postgres implementation packaged as a TypeScript client library, enabling Postgres to run in browsers, Node.js, and Bun without external dependencies. The library is 2.6mb gzipped.

**Key characteristics:**
- Pure WASM Postgres (no Linux VM required)
- Supports ephemeral in-memory databases
- Supports persistent storage: file system (Node/Bun) or indexedDB (Browser)

**Usage:**
```ts
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { users } from './schema';

const client = new PGlite();
const db = drizzle(client);

await db.select().from(users);
```

The drizzle-orm integration allows you to use PGlite as a database client with the standard Drizzle ORM API.