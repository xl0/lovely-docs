## What is Drizzle ORM

Drizzle ORM is a headless TypeScript ORM designed to be lightweight, performant, typesafe, and serverless-ready. It's a library and collection of opt-in tools that lets you build projects your way without forcing you to structure code around the framework.

## Core Philosophy

Unlike traditional data frameworks (Django-like, Spring-like) that require building projects around them, Drizzle is non-intrusive. It provides tools you use when needed without interfering with your project structure.

## SQL-Like Query API

Drizzle embraces SQL as its core design principle. If you know SQL, you know Drizzle - there's minimal learning curve because the API mirrors SQL syntax rather than abstracting it away.

Example schema definition:
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

SQL-like query example:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

This generates corresponding SQL migrations automatically.

## Relational Query API

For scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently. Drizzle always outputs exactly 1 SQL query, making it suitable for serverless databases without performance concerns.

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Key Features

- **Zero dependencies**: Drizzle has exactly 0 dependencies, making it slim and serverless-ready by design
- **Dialect-specific**: Best-in-class support for PostgreSQL, MySQL, SQLite, and SingleStore
- **Native drivers**: Operates through industry-standard database drivers
- **TypeScript schema management**: Define and manage database schemas in TypeScript
- **Automatic migrations**: Generate migrations from schema definitions

## Use Cases

Define schemas in TypeScript, query data using either SQL-like syntax or relational API, and leverage opt-in tools for enhanced developer experience. Works with PostgreSQL, MySQL, SQLite, or SingleStore databases.