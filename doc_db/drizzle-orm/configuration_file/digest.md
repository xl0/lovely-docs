## Drizzle Kit Configuration File

Drizzle Kit uses TypeScript or JavaScript configuration files (typically `drizzle.config.ts`) to declare all configuration options. The config file is placed in the project root alongside `package.json`.

### Core Configuration Options

**`dialect`** (required)
- Specifies the database type: `postgresql`, `mysql`, `sqlite`, `turso`, or `singlestore`
- Used by commands: `generate`, `migrate`, `push`, `pull`, `check`, `up`

**`schema`** (required)
- Glob-based path to schema file(s) or folder(s)
- Accepts `string` or `string[]`
- Used by: `generate`, `push`

**`out`** (optional, default: `"drizzle"`)
- Output folder for SQL migration files, JSON snapshots, and generated schema
- Used by: `generate`, `migrate`, `push`, `pull`, `check`, `up`

**`driver`** (optional)
- Explicitly specify database driver when auto-detection isn't sufficient
- Examples: `pglite`, `d1-http`, `aws-data-api`
- Used by: `migrate`, `push`, `pull`

**`dbCredentials`** (required for most commands)
- Database connection configuration, varies by dialect:
  - PostgreSQL: `url` or `{host, port, user, password, database, ssl}`
  - MySQL: `url` or `{host, port, user, password, database, ssl}`
  - SQLite: `url` (`:memory:`, `sqlite.db`, or `file:sqlite.db`)
  - Turso: `url` and `authToken`
  - Cloudflare D1: `accountId`, `databaseId`, `token`
  - AWS Data API: `database`, `resourceArn`, `secretArn`
  - PGLite: `url` (folder path)

### Filtering and Schema Management

**`tablesFilter`** (optional)
- Glob-based filter for table names (e.g., `["users", "posts"]` or `"user*"`)
- Used by: `generate`, `push`, `pull`

**`schemaFilter`** (optional, default: `["public"]`)
- List of schemas to manage (PostgreSQL only)
- Used by: `push`, `pull`

**`extensionsFilters`** (optional, default: `[]`)
- List of database extensions to ignore (e.g., `["postgis"]`)
- Used by: `push`, `pull`

### Advanced Options

**`migrations`** (optional)
- Configure migration logging table and schema
- Default: `{ table: "__drizzle_migrations", schema: "drizzle" }`
- Options: `{ table: string, schema: string }`
- Used by: `migrate`

**`introspect`** (optional)
- Configuration for `drizzle-kit pull` command
- `casing`: `"preserve"` or `"camel"` (default: `"camel"`)
- Controls how column names are converted in generated code

**`entities`** (optional)
- Manage database entities like roles
- `roles`: `boolean | { provider: "neon" | "supabase", include: string[], exclude: string[] }`
- Default: `false`
- Used by: `push`, `pull`, `generate`

**`strict`** (optional, default: `false`)
- Require confirmation before running SQL statements in `push` command

**`verbose`** (optional, default: `true`)
- Print all SQL statements during `push` and `pull` commands

**`breakpoints`** (optional, default: `true`)
- Embed `--> statement-breakpoint` in generated migrations (required for MySQL and SQLite)

### Multiple Configuration Files

You can maintain separate config files for different environments or databases:
```bash
drizzle-kit generate --config=drizzle-dev.config.ts
drizzle-kit generate --config=drizzle-prod.config.ts
```

### Example Configurations

Basic PostgreSQL setup:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

Extended configuration with multiple options:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  entities: {
    roles: {
      provider: 'supabase',
      exclude: ['admin']
    }
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

Role management examples:
```ts
// Enable role management
export default defineConfig({
  entities: { roles: true }
});

// Exclude specific roles
export default defineConfig({
  entities: { roles: { exclude: ['admin'] } }
});

// Use provider presets (Neon/Supabase)
export default defineConfig({
  entities: { roles: { provider: 'neon' } }
});

// Combine provider with exclusions
export default defineConfig({
  entities: { roles: { provider: 'supabase', exclude: ['new_role'] } }
});
```