## Bug Fixes

- Fixed RQB (Relational Query Builder) behavior for tables with identical names across different schemas
- Fixed type hint mismatch when using RDS Data API (issue #2097)

## New Prisma-Drizzle Extension

A new extension enables seamless integration between Prisma and Drizzle ORM, allowing you to use Drizzle queries within Prisma's client:

```ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';
import { User } from './drizzle';

const prisma = new PrismaClient().$extends(drizzle());
const users = await prisma.$drizzle.select().from(User);
```

The extension is accessed via `prisma.$drizzle` and supports standard Drizzle query operations like `select().from()`. Additional documentation available in the Prisma integration guide.