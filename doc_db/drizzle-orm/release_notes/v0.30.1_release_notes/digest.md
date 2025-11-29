## OP-SQLite Driver Support

Added support for the OP-SQLite driver. To use it, import the driver from `@op-engineering/op-sqlite` and initialize it with a database name, then pass it to `drizzle()`:

```ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);

await db.select().from(users);
```

## Fixes

- Migration hook fixed for Expo driver