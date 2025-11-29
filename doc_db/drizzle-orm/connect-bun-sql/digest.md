## Bun SQL Integration

Drizzle ORM natively supports the `bun sql` module for PostgreSQL database connections with high performance.

### Prerequisites
- Database connection basics with Drizzle
- Bun runtime (JavaScript runtime)
- Bun SQL - native PostgreSQL bindings

### Installation
Install `drizzle-orm` and `drizzle-kit` as dev dependency:
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Basic Usage
Initialize the driver with a database URL:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';

const db = drizzle(process.env.DATABASE_URL);
const result = await db.select().from(...);
```

### Using Existing Driver
If you have an existing Bun SQL driver instance, pass it to Drizzle:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });
```