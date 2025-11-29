## Unique Case-Insensitive Email Index

Create a unique index on `lower(email)` to ensure emails are unique regardless of case.

**PostgreSQL:**
```ts
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const users = pgTable('users', {...}, (table) => [
  uniqueIndex('emailUniqueIndex').on(lower(table.email)),
]);

// Query
const findUserByEmail = async (email: string) => {
  return await db.select().from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

**MySQL:** Same pattern, but wrap expression in parentheses: `sql`(lower(${email}))``. Requires MySQL 8.0.13+.

**SQLite:** Same pattern as PostgreSQL.

Requires drizzle-orm@0.31.0+ and drizzle-kit@0.22.0+.