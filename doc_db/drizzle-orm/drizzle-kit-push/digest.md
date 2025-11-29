## `drizzle-kit push` Command

Pushes schema and schema changes directly to the database without generating SQL files. Implements code-first migrations approach.

### How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Introspects current database schema
3. Generates SQL migrations based on differences
4. Applies migrations to the database

### Configuration
Requires `dialect`, path to `schema` file(s), and database connection details. Can be provided via `drizzle.config.ts` or CLI options.

**Config file example:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

**CLI example:**
```shell
npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=postgresql://user:password@host:port/dbname
```

### Schema files
- Can use single or multiple schema files
- Specify paths using glob patterns via `schema` option
- Example: `"./src/schema/**/*.ts"` or `["./src/schema.ts", "./src/auth/schema.ts"]`

### Multiple config files
Support multiple config files for different database stages or databases:
```shell
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

### Database drivers
Drizzle Kit automatically picks available driver based on `dialect`. For exceptions like `aws-data-api`, `pglight`, and `d1-http`, explicitly specify `driver` param.

**Note:** Expo SQLite and OP SQLite (on-device databases) don't support `push` - use embedded migrations instead.

### Filtering tables, schemas, and extensions
Configure what to manage:
- `tablesFilter`: glob-based table names filter, default `"*"`
- `schemaFilter`: schema names filter, default `["public"]`
- `extensionsFilters`: list of installed extensions to ignore, default `[]`

**Example:**
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```

### CLI-only options
- `verbose`: print all SQL statements before execution
- `strict`: ask for approval before executing SQL statements
- `force`: auto-accept all data-loss statements

```shell
npx drizzle-kit push --strict --verbose --force
```

### All configuration options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | yes | Path to schema file(s) or folder with glob patterns |
| `driver` | | Driver exception (aws-data-api, pglight, d1-http) |
| `tablesFilter` | | Table name filter |
| `schemaFilter` | | Schema name filter, default `["public"]` |
| `extensionsFilters` | | Database extensions to ignore |
| `url` | | Database connection string |
| `user` | | Database user |
| `password` | | Database password |
| `host` | | Host |
| `port` | | Port |
| `database` | | Database name |
| `config` | | Config file path, default `drizzle.config.ts` |

**CLI examples:**
```shell
npx drizzle-kit push dialect=postgresql schema=src/schema.ts url=postgresql://user:password@host:port/dbname
npx drizzle-kit push dialect=postgresql schema=src/schema.ts driver=pglite url=database/
npx drizzle-kit push dialect=postgresql schema=src/schema.ts --tablesFilter='user*' --extensionsFilters=postgis url=postgresql://user:password@host:port/dbname
```

### Use case example
Define schema and push to database:

**drizzle.config.ts:**
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

**src/schema.ts:**
```ts
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

Run `npx drizzle-kit push` to generate and apply:
```sql
CREATE TABLE "users"(
  id serial primary key,
  name text
)
```

### Best practices
- Ideal for rapid prototyping and code-first development
- Works well with blue/green deployment strategy
- Suitable for serverless databases (Planetscale, Neon, Turso)
- Recommended for production applications