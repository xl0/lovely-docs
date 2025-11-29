## What is Drizzle ORM

Drizzle is a headless TypeScript ORM designed to be lightweight, performant, typesafe, and serverless-ready. It's a library with opt-in complementary tools that lets you build projects your way without forcing a specific structure around it.

Key distinction: Drizzle is not a "data framework" (like Django or Spring) that requires building projects around it. Instead, it's a library you build projects with.

## Core Features

**SQL-like Query API**: If you know SQL, you know Drizzle. The query API mirrors SQL syntax, eliminating the double learning curve of learning both SQL and a framework's custom API. You get familiar SQL schema declaration, queries, automatic migrations, and full SQL power.

Example query:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

Schema definition:
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

Generated migrations are standard SQL:
```sql
CREATE TABLE IF NOT EXISTS "countries" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256),
  "country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
```

**Relational Query API**: For common scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently and performantly. Crucially, Drizzle always outputs exactly 1 SQL query regardless of nesting depth, making it safe for serverless databases without performance or roundtrip cost concerns.

Example:
```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Technical Details

**Zero Dependencies**: Drizzle has exactly 0 dependencies, making it slim and serverless-ready by design.

**Database Support**: Dialect-specific implementation with native support for PostgreSQL, MySQL, and SQLite through industry-standard drivers. The library operates natively through these drivers rather than abstracting them.

**TypeScript**: Full TypeScript support with type safety throughout.

## Philosophy

Drizzle is described as "a good friend who's there for you when necessary and doesn't bother when you need some space" - emphasizing its non-intrusive nature and flexibility.