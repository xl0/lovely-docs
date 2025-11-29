## Neon Postgres Connection

**Drivers:** `neon-http` (single transactions, serverless), `neon-websockets` (interactive transactions), or PostgresJS (serverful).

**Installation:**
```
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

**Neon HTTP:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);
```

**Neon WebSockets (Node.js requires ws + bufferutil):**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
const db = drizzle(process.env.DATABASE_URL);
// For Node.js: configure neonConfig.webSocketConstructor = ws
```

**With existing driver:**
```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

**node-postgres or postgres.js** also supported for serverful environments.