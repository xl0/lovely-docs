## AWS Data API PostgreSQL Connection

Install `drizzle-orm` and `@aws-sdk/client-rds-data`. Initialize with:

```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';

const db = drizzle({ 
  connection: {
    database: process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
  }
});
```

Or pass an existing RDSDataClient instance to drizzle with the same connection config.