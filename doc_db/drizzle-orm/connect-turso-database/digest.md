## Turso Database Integration

Turso is a small database designed to power applications in the AI age. It provides SQLite-compatible database functionality.

### Installation

Install the required packages:
```
drizzle-orm@beta @tursodatabase/database
-D drizzle-kit@beta
```

### Basic Setup

Initialize the driver and execute queries:

```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const db = drizzle('sqlite.db');
const result = await db.execute('select 1');
```

### Using Existing Driver Instance

If you have an existing Turso driver instance, pass it to drizzle:

```typescript
import { Database } from '@tursodatabase/drivers';
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const client = new Database('sqlite.db');
const db = drizzle({ client });
const result = await db.execute('select 1');
```

### Prerequisites

- Understanding of database connection basics with Drizzle
- Turso Database account and knowledge of its basics
- Turso Database JavaScript driver installed