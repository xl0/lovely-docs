DrizzleORM v0.31.2 added support for TiDB Cloud Serverless driver. To use it, import the connect function from @tidbcloud/serverless and the drizzle function from drizzle-orm/tidb-serverless. Create a client by calling connect with a URL configuration, then initialize the database instance by passing the client to drizzle(). After setup, you can execute queries normally using the db instance.

Example:
```ts
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: '...' });
const db = drizzle(client);
await db.select().from(...);
```