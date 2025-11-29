## MySQL Setup

Install `drizzle-orm`, `mysql2`, and `drizzle-kit`:
```
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

Initialize with URL or config:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle(process.env.DATABASE_URL);
// or
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
```

Use existing connections:
```typescript
// Single client
const connection = await mysql.createConnection({ host, user, database });
const db = drizzle({ client: connection });

// Pool
const pool = mysql.createPool({ host, user, database });
const db = drizzle({ client: pool });
```

**Note:** Use single client for migrations, either client or pool for queries.