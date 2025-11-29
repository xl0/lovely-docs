## TiDB Serverless Setup

TiDB Serverless is a managed DBaaS with HTTP driver support for edge environments, MySQL-compatible.

**Installation:**
```
drizzle-orm @tidbcloud/serverless
-D drizzle-kit
```

**Quick start:**
```typescript
import { drizzle } from 'drizzle-orm/tidb-serverless';
const db = drizzle({ connection: { url: process.env.TIDB_URL }});
```

**With existing driver:**
```typescript
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';
const client = connect({ url: process.env.TIDB_URL });
const db = drizzle({ client });
```