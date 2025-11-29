## Purpose
`drizzle-kit generate` creates SQL migrations from your Drizzle schema definitions. It compares your current schema against previous migration snapshots and generates the necessary SQL to transform the database.

## How It Works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Compares snapshot against the most recent migration snapshot
3. Generates SQL migration file based on differences
4. Saves `migration.sql` and `snapshot.json` with a timestamp

## Basic Usage
Requires `dialect` and `schema` configuration, provided via `drizzle.config.ts` or CLI:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit generate
```

Or via CLI:
```shell
npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts
```

## Schema Files
- Can use single or multiple schema files
- Specify paths using glob patterns via `schema` config option
- Example: `"./src/**/*.schema.ts"` matches all schema files in src directory

## Custom Migration Names
```shell
npx drizzle-kit generate --name=init
```
Creates migration file like `0000_init.sql`

## Multiple Config Files
Support multiple config files for different database stages or databases:
```shell
npx drizzle-kit generate --config=drizzle-dev.config.ts
npx drizzle-kit generate --config=drizzle-prod.config.ts
```

## Custom Migrations
Generate empty migration files for custom SQL or unsupported DDL operations:
```shell
drizzle-kit generate --custom --name=seed-users
```
Creates empty `0001_seed-users.sql` for manual SQL writing.

## Configuration Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | Yes | Path to schema file(s) or folder with glob patterns |
| `out` | No | Migrations output folder, default `./drizzle` |
| `config` | No | Config file path, default `drizzle.config.ts` |
| `breakpoints` | No | SQL statement breakpoints, default `true` |
| `custom` | No | Generate empty SQL for custom migration |
| `name` | No | Custom migration file name |

## Extended Example
Config file at `./configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
});
```

Generate custom migration:
```shell
npx drizzle-kit generate --config=./configs/drizzle.config.ts --name=seed-users --custom
```

Creates `./migrations/0001_seed-users.sql` with custom SQL content.

## Migration Application
Generated migrations can be applied using:
- `drizzle-kit migrate` command
- Drizzle ORM's `migrate()` function
- External tools like Bytebase
- Direct database execution