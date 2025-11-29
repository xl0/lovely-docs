## Purpose
`drizzle-kit export` generates SQL DDL representation of a Drizzle schema and outputs it to console. It's designed for the codebase-first approach to migrations, allowing external tools like Atlas to handle migrations.

## How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Generates SQL DDL statements based on the schema
3. Outputs SQL DDL to console

## Configuration
Requires `dialect` and `schema` options, configurable via `drizzle.config.ts` or CLI:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

```shell
npx drizzle-kit export
# or with CLI options
npx drizzle-kit export --dialect=postgresql --schema=./src/schema.ts
```

## Schema paths
- Can use single or multiple schema files
- Specify paths via glob patterns in `schema` config option
- Example: `"./src/schema/**/*.ts"` matches all TypeScript files in schema directory

## Multiple config files
Support multiple config files for different database stages or databases:

```shell
npx drizzle-kit export --config=drizzle-dev.config.ts
npx drizzle-kit export --config=drizzle-prod.config.ts
```

## CLI options
- `--sql`: Generate SQL representation (default output format)
- `--config`: Path to config file (default: `drizzle.config.ts`)

## Example
Config file at `configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Schema at `src/schema.ts`:
```ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});
```

Running:
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