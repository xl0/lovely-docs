**Setup:** Install drizzle-orm and gel, create drizzle.config.ts with `dialect: 'gel'`, run `drizzle-kit pull` to generate schema.

**Connect:** Create Gel client and initialize Drizzle:
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const db = drizzle({ client: createClient() });
```

**Query:** Use standard Drizzle operations (insert, select, update, delete) with generated schema tables. Run with `npx tsx src/index.ts`.