## Bug Fixes
- Fixed RQB for tables with same names in different schemas
- Fixed type hints with RDS Data API

## Prisma-Drizzle Extension
New extension integrates Drizzle queries into Prisma client:
```ts
const prisma = new PrismaClient().$extends(drizzle());
const users = await prisma.$drizzle.select().from(User);
```