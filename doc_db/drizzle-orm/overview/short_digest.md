## Drizzle ORM Overview

Headless TypeScript ORM with zero dependencies, designed for serverless environments. Embraces SQL as core design - if you know SQL, you know Drizzle.

**Two query APIs:**
- SQL-like: Direct SQL syntax mirroring
- Relational: Nested data fetching with single SQL query output

**Schema definition in TypeScript:**
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});
```

**SQL-like queries:**
```typescript
await db.select().from(countries).leftJoin(cities, eq(cities.countryId, countries.id))
```

**Relational queries:**
```typescript
await db.query.users.findMany({ with: { posts: true } })
```

Supports PostgreSQL, MySQL, SQLite, SingleStore with automatic migration generation. Non-intrusive design lets you build projects your way without framework constraints.