## Fixes
- Fixed withReplica feature to correctly forward arguments
- Fixed selectDistinctOn to work with multiple columns

## New Features

### Enhanced JSDoc Documentation
All query builders across all dialects now include detailed JSDoc with hints, documentation links, and IDE integration support.

### Aggregate Function Helpers
New SQL helper functions for aggregation operations (typically used with GROUP BY):

- `count()` / `count(column)` - equivalent to `sql\`count('*')\`` or `sql\`count(${column})\``
- `countDistinct(column)` - equivalent to `sql\`count(distinct ${column})\``
- `avg(column)` / `avgDistinct(column)` - equivalent to `sql\`avg(${column})\`` or `sql\`avg(distinct ${column})\``
- `sum(column)` / `sumDistinct(column)` - equivalent to `sql\`sum(${column})\`` or `sql\`sum(distinct ${column})\``
- `max(column)` / `min(column)` - equivalent to `sql\`max(${column})\`` or `sql\`min(${column})\``

Example usage:
```ts
await db.select({ value: count() }).from(users);
await db.select({ value: countDistinct(users.id) }).from(users);
await db.select({ value: avg(users.id) }).from(users);
```

## New Package: Drizzle ESLint Plugin

ESLint plugin providing rules for scenarios where type checking is insufficient or produces unclear error messages.

### Installation
```
npm install eslint eslint-plugin-drizzle @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configuration
Create `.eslintrc.yml`:
```yaml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
extends:
  - "plugin:drizzle/recommended"
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

### Rules

**enforce-delete-with-where**: Prevents accidental deletion of all table rows by requiring `.where()` clause in delete statements. Optionally configure `drizzleObjectName` to target specific objects (e.g., only `db.delete()`, not other class delete methods).

**enforce-update-with-where**: Prevents accidental update of all table rows by requiring `.where()` clause in update statements. Same `drizzleObjectName` configuration option available.

Example with drizzleObjectName:
```json
"rules": {
  "drizzle/enforce-delete-with-where": ["error", { "drizzleObjectName": ["db"] }]
}
```