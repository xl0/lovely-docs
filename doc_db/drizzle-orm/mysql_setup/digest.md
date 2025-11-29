## MySQL Setup with Drizzle ORM

Drizzle ORM supports MySQL through the `mysql2` driver, a high-performance MySQL client for Node.js.

### Installation
Install `drizzle-orm`, `mysql2`, and `drizzle-kit` (dev dependency):
```
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Basic Usage
Initialize the driver with a database URL:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle(process.env.DATABASE_URL);
const response = await db.select().from(...)
```

Or with explicit connection config:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
const response = await db.select().from(...)
```

### Using Existing Driver Connections

**Client connection** (single connection):
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "host",
  user: "user",
  database: "database",
});
const db = drizzle({ client: connection });
```

**Pool connection** (connection pool):
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  host: "host",
  user: "user",
  database: "database",
});
const db = drizzle({ client: poolConnection });
```

### Important Notes
- For DDL migrations using the built-in `migrate` function, use a single client connection
- For querying, you can use either client or pool connections based on your needs