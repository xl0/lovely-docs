## TiDB Serverless Integration

TiDB Serverless is a fully-managed, autonomous DBaaS with split-second cluster provisioning and consumption-based pricing. It is compatible with MySQL and provides an HTTP driver for edge environments, natively supported by Drizzle ORM.

### Installation

Install the required packages:
```
drizzle-orm @tidbcloud/serverless
-D drizzle-kit
```

### Basic Setup

Initialize the driver with connection URL:
```typescript
import { drizzle } from 'drizzle-orm/tidb-serverless';

const db = drizzle({ connection: { url: process.env.TIDB_URL }});
const response = await db.select().from(...)
```

### Using Existing Driver

If you have an existing TiDB Serverless driver instance, pass it to Drizzle:
```typescript
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: process.env.TIDB_URL });
const db = drizzle({ client });
```

### Prerequisites

- Database connection basics with Drizzle
- TiDB database account
- TiDB HTTP Driver
- Drizzle MySQL drivers knowledge (since TiDB is MySQL-compatible)