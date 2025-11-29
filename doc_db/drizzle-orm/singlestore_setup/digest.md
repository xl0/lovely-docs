## Installation
Install `drizzle-orm`, `mysql2`, and `drizzle-kit` (dev dependency).

## Driver Initialization
Use `drizzle-orm/singlestore` package with `mysql2` driver.

Initialize with connection string:
```typescript
import { drizzle } from "drizzle-orm/singlestore";
const db = drizzle(process.env.DATABASE_URL);
```

Or with explicit config:
```typescript
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
```

## Existing Driver Integration
Pass existing `mysql2` client or pool connection:
```typescript
import { drizzle } from "drizzle-orm/singlestore";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({ host: "host", user: "user", database: "database" });
const db = drizzle({ client: connection });
```

Or with pool:
```typescript
const poolConnection = mysql.createPool({ host: "host", user: "user", database: "database" });
const db = drizzle({ client: poolConnection });
```

Use single client connection for migrations with DDL. Use either client or pool for queries based on requirements.

## Limitations
- Serial column type only ensures uniqueness, not auto-increment behavior
- `ORDER BY` and `LIMIT` cannot be chained
- Foreign keys not supported
- `INTERSECT ALL` and `EXCEPT ALL` not supported
- Nested transactions not supported
- Only one `isolationLevel` supported
- FSP option in `DATE`, `TIMESTAMP`, `DATETIME` not supported
- Relational API not supported (pending SingleStore API development)
- Additional limitations due to incomplete MySQL compatibility