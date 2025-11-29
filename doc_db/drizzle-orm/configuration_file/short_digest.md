## Drizzle Kit Configuration File

Configuration file (typically `drizzle.config.ts`) declares all Drizzle Kit options.

**Required options:**
- `dialect`: Database type (`postgresql`, `mysql`, `sqlite`, `turso`, `singlestore`)
- `schema`: Glob path to schema file(s)
- `dbCredentials`: Connection details (varies by dialect)

**Common options:**
- `out`: Migration output folder (default: `"drizzle"`)
- `driver`: Explicit driver selection (e.g., `pglite`, `d1-http`, `aws-data-api`)
- `tablesFilter`: Glob filter for table names
- `schemaFilter`: List of schemas to manage (default: `["public"]`)
- `extensionsFilters`: Extensions to ignore (e.g., `["postgis"]`)
- `migrations`: Configure migration table/schema
- `introspect`: Set column name casing for `pull` command (`"camel"` or `"preserve"`)
- `entities.roles`: Manage database roles with include/exclude/provider options
- `strict`: Require confirmation before `push`
- `verbose`: Print SQL statements
- `breakpoints`: Embed statement breakpoints in migrations (default: `true`)

**Multiple configs:** Use `--config` flag to specify different config files for different environments.

**Example:**
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: "postgres://user:pass@host/db" },
  introspect: { casing: "camel" },
  entities: { roles: { provider: 'supabase', exclude: ['admin'] } }
});
```