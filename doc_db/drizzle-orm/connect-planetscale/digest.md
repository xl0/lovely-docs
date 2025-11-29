## PlanetScale Integration

PlanetScale is a serverless MySQL platform. Drizzle ORM provides access to PlanetScale via HTTP through the `@planetscale/database` driver using the `drizzle-orm/planetscale-serverless` package, suitable for both serverless and traditional server environments. TCP access via `mysql2` driver is also available.

### Installation
```
npm install drizzle-orm @planetscale/database
npm install -D drizzle-kit
```

### Basic Setup
Initialize the driver with connection credentials:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";

const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});

const response = await db.select().from(...)
```

### Using Existing Client
If you have an existing PlanetScale client instance, pass it to drizzle:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle({ client });
```

Prerequisites: familiarity with database connection basics, PlanetScale account and documentation, and Drizzle MySQL drivers.