## AWS Data API PostgreSQL Connection

Connect Drizzle ORM to AWS RDS Aurora PostgreSQL using the AWS Data API.

### Prerequisites
- Database connection basics with Drizzle
- AWS Data API (see AWS RDS Aurora documentation)
- AWS SDK for JavaScript v3

### Installation
```
npm install drizzle-orm @aws-sdk/client-rds-data
npm install -D drizzle-kit
```

### Basic Setup
Initialize the driver with required connection properties:

```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';

const db = drizzle({ 
  connection: {
    database: process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
  }
});

await db.select().from(...);
```

### Using Existing RDSDataClient
If you have an existing RDSDataClient instance, pass it to drizzle:

```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';

const rdsClient = new RDSDataClient({ region: 'us-east-1' });

const db = drizzle(rdsClient, {
  database: process.env['DATABASE']!,
  secretArn: process.env['SECRET_ARN']!,
  resourceArn: process.env['RESOURCE_ARN']!,
});

await db.select().from(...);
```

The connection object accepts any additional properties from the RDSDataClient type.