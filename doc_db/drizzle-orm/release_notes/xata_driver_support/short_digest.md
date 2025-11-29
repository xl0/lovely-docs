## Xata Driver Support Added

Drizzle ORM v0.30.4 adds native support for Xata, a Postgres data platform. Install `drizzle-orm` and `@xata.io/client`, then use:

```ts
import { drizzle } from 'drizzle-orm/xata-http';
import { getXataClient } from './xata';

const db = drizzle(getXataClient());
const result = await db.select().from(...);
```

Alternatively, connect via standard `pg` or `postgres.js` drivers.