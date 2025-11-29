## Drizzle ORM Overview

Headless TypeScript ORM with zero dependencies, designed for serverless environments. Provides two query APIs:

1. **SQL-like API**: Mirrors SQL syntax for developers who know SQL
   ```typescript
   await db.select().from(countries).leftJoin(cities, eq(cities.countryId, countries.id))
   ```

2. **Relational Query API**: Fetches nested data in a single SQL query
   ```typescript
   await db.query.users.findMany({ with: { posts: true } })
   ```

Schema defined in TypeScript with automatic migration generation. Supports PostgreSQL, MySQL, and SQLite through native drivers. Non-intrusive library that doesn't force project structure.