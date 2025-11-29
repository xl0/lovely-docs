## Purpose
Exports SQL DDL representation of Drizzle schema to console for codebase-first migrations.

## Configuration
Requires `dialect` and `schema` via config file or CLI:
```ts
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit export
```

## Schema paths
Use glob patterns for single or multiple schema files.

## Multiple configs
Support different config files per database stage:
```shell
npx drizzle-kit export --config=drizzle-dev.config.ts
```

## Example
```ts
// schema.ts
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});
```
```shell
npx drizzle-kit export --config=./configs/drizzle.config.ts
```
Output:
```sql
CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "name" text
);
```