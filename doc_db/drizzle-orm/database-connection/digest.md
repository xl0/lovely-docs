## Database Connection Overview

Drizzle ORM executes SQL queries through database drivers. The core pattern is:
1. Import a driver-specific drizzle function
2. Initialize with connection parameters
3. Execute queries through the db instance

### Basic Setup
```ts
import { drizzle } from "drizzle-orm/node-postgres"
const db = drizzle(process.env.DATABASE_URL);
const usersCount = await db.$count(users);
```

The drizzle instance translates ORM queries into SQL, which the driver sends to the database and returns results.

### Accessing the Underlying Driver
Access the native driver client via `db.$client`:
```ts
const pool = db.$client;
```

This is equivalent to manually creating a driver instance:
```ts
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Supported Drivers

**PostgreSQL drivers:**
- node-postgres (standard)
- Neon HTTP
- Neon with websockets
- Vercel Postgres
- Supabase
- Xata
- PGLite

**MySQL drivers:**
- MySQL
- PlanetScale HTTP
- TiDB

**SQLite drivers:**
- SQLite
- Turso Cloud
- Turso Database
- Cloudflare D1
- Bun SQLite
- SQLite Cloud

**Native SQLite (runtime-specific):**
- Expo SQLite
- OP SQLite
- React Native SQLite

**Other:**
- Drizzle Proxy

### Edge/Serverless Runtime Support
Drizzle is natively compatible with edge and serverless runtimes. Examples:

```ts
// Neon HTTP
import { drizzle } from "drizzle-orm/neon-http";
const db = drizzle(process.env.DATABASE_URL);

// Vercel Postgres
import { drizzle } from "drizzle-orm/vercel-postgres";
const db = drizzle();

// PlanetScale HTTP
import { drizzle } from "drizzle-orm/planetscale";
const db = drizzle(process.env.DATABASE_URL);

// Cloudflare D1
import { drizzle } from "drizzle-orm/d1";
const db = drizzle({ connection: env.DB });

// Bun SQLite
import { drizzle } from "drizzle-orm/bun-sqlite";
const db = drizzle("./sqlite.db");

// Expo SQLite
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
```

### Database Connection URL Format
```
postgresql://role:password@hostname/database
```
Example: `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname`