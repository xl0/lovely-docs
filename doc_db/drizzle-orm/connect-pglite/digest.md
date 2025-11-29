## PGlite Integration

PGlite is a WASM-based Postgres build packaged as a TypeScript client library that runs Postgres in browser, Node.js, and Bun without external dependencies. It's 2.6mb gzipped and uses native WASM instead of a Linux VM. Supports ephemeral in-memory databases or persistent storage via filesystem (Node/Bun) or indexedDB (browser).

### Installation

```
npm install drizzle-orm @electric-sql/pglite
npm install -D drizzle-kit
```

### Usage

**In-memory database:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle();
await db.select().from(...);
```

**With filesystem persistence:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle('path-to-dir');
await db.select().from(...);
```

**With advanced configuration:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle({ connection: { dataDir: 'path-to-dir' }});
await db.select().from(...);
```

**Using existing PGlite driver instance:**
```typescript
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
const client = new PGlite();
const db = drizzle({ client });
await db.select().from(users);
```