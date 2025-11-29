## Drizzle Extension for Prisma

Extend Prisma client to use Drizzle queries alongside Prisma, sharing the same database connection.

### Setup

1. Install: `drizzle-orm@latest` and `-D drizzle-prisma-generator`
2. Add generator to Prisma schema with output path
3. Run `prisma generate`
4. Extend client: `new PrismaClient().$extends(drizzle())` (import from `drizzle-orm/prisma/pg|mysql|sqlite`)

### Usage

```ts
import { User } from './drizzle';
await prisma.$drizzle.insert().into(User).values({ email: 'test@example.com', name: 'Test' });
const users = await prisma.$drizzle.select().from(User);
```

### Limitations

- Relational queries unsupported (Prisma driver limitation)
- SQLite: `.values()` unsupported
- Prepared statements: `.prepare()` only builds SQL, no actual prepared statement support