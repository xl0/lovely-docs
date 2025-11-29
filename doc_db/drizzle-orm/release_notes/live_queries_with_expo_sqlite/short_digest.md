## Live Queries for Expo SQLite

Drizzle ORM v0.31.1 adds `useLiveQuery` React Hook for Expo SQLite that automatically re-renders when database data changes.

**Setup:**
```tsx
const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);
```

**Usage:**
```tsx
const { data, error, updatedAt } = useLiveQuery(db.select().from(users));
```

Works with both SQL-like and Drizzle query syntax. Returns `data`, `error`, and `updatedAt` for explicit error handling.