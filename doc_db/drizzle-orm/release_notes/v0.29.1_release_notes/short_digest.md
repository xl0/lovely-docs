## Fixes
- Fixed withReplica argument forwarding
- Fixed selectDistinctOn with multiple columns

## Aggregate Function Helpers
New helpers: `count()`, `countDistinct()`, `avg()`, `avgDistinct()`, `sum()`, `sumDistinct()`, `max()`, `min()`

```ts
await db.select({ value: count() }).from(users);
await db.select({ value: countDistinct(users.id) }).from(users);
```

## Enhanced JSDoc
Detailed documentation now available in IDE for all query builders across all dialects.

## ESLint Plugin
New `eslint-plugin-drizzle` package with rules:
- `enforce-delete-with-where` - require WHERE clause in delete statements
- `enforce-update-with-where` - require WHERE clause in update statements

Both support optional `drizzleObjectName` config to target specific objects.