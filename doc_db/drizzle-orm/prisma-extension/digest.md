## Drizzle Extension for Prisma

Allows using Drizzle alongside Prisma in existing projects by extending the Prisma client with Drizzle API, reusing the same database connection.

### Installation

Install dependencies:
```
drizzle-orm@latest
-D drizzle-prisma-generator
```

### Setup

1. Add Drizzle generator to Prisma schema:
```prisma
generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle"
}
```

2. Run `prisma generate` to create Drizzle schema files.

3. Extend Prisma client with Drizzle (choose based on database):
```ts
// PostgreSQL
import { drizzle } from 'drizzle-orm/prisma/pg';
const prisma = new PrismaClient().$extends(drizzle());

// MySQL
import { drizzle } from 'drizzle-orm/prisma/mysql';
const prisma = new PrismaClient().$extends(drizzle());

// SQLite
import { drizzle } from 'drizzle-orm/prisma/sqlite';
const prisma = new PrismaClient().$extends(drizzle());
```

### Usage

Import generated Drizzle tables and use via `prisma.$drizzle`:
```ts
import { User } from './drizzle';

await prisma.$drizzle.insert().into(User).values({ email: 'sorenbs@drizzle.team', name: 'Søren' });
const users = await prisma.$drizzle.select().from(User);
```

### Limitations

- Relational queries not supported due to Prisma driver limitation - Prisma cannot return results in array format required for relational queries.
- SQLite: `.values()` not supported for the same reason.
- Prepared statements: `.prepare()` only builds SQL on Drizzle side; no Prisma API exists for prepared queries.