## SQLite Cloud Connection Setup

SQLite Cloud is a managed, distributed relational database system built on SQLite. This page covers connecting Drizzle ORM to SQLite Cloud.

### Prerequisites
- Database connection basics with Drizzle
- SQLite Cloud database account
- SQLite Cloud JavaScript driver

### Installation
Install required packages:
```
drizzle-orm@beta @sqlitecloud/drivers
-D drizzle-kit@beta
```

### Basic Connection
Initialize the driver using a connection string:
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const db = drizzle(process.env.SQLITE_CLOUD_CONNECTION_STRING);
const result = await db.execute('select 1');
```

### Using Existing Driver Instance
If you have an existing SQLite Cloud driver instance, pass it to Drizzle:
```typescript
import { Database } from '@sqlitecloud/drivers';
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);
const db = drizzle({ client });
const result = await db.execute('select 1');
```

Both approaches support executing queries through the initialized `db` instance.