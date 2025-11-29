## Purpose
`drizzle-kit pull` introspects an existing database schema and generates a TypeScript Drizzle schema file (`schema.ts`). It's designed for database-first migration approaches where the database schema is managed outside the TypeScript project or by external teams.

## How It Works
The command connects to your database, extracts the DDL (Data Definition Language), and generates a corresponding Drizzle schema file in the configured output folder (default: `./drizzle`).

## Configuration
Configuration can be provided via `drizzle.config.ts` or CLI options. Required parameters:
- `dialect`: Database type (postgresql, mysql, sqlite, etc.)
- Connection details: either `url` string or individual `user`, `password`, `host`, `port`, `database` parameters

Example config file:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

CLI usage:
```shell
npx drizzle-kit pull
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Multiple Configuration Files
Support multiple config files for different database stages or environments:
```shell
npx drizzle-kit pull --config=drizzle-dev.config.ts
npx drizzle-kit pull --config=drizzle-prod.config.ts
```

## Database Drivers
Drizzle Kit automatically detects available drivers based on dialect. For special drivers (aws-data-api, pglite, d1-http), explicitly specify the `driver` parameter:

```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});
```

Note: Expo SQLite and OP SQLite (on-device databases) cannot be pulled; use embedded migrations instead.

## Filtering Tables, Schemas, and Extensions
Control which database objects are introspected:
- `tablesFilter`: Glob-based table name filter (default: `"*"`)
- `schemaFilter`: Schema names to include (default: `["public"]`)
- `extensionsFilters`: List of extensions to ignore (default: `[]`)

Example:
```ts
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```

## Configuration Options Reference
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `driver` | No | Driver exception (aws-data-api, pglite, d1-http) |
| `out` | No | Output folder path (default: `./drizzle`) |
| `url` | No | Database connection string |
| `user`, `password`, `host`, `port`, `database` | No | Individual connection parameters |
| `config` | No | Config file path (default: `drizzle.config.ts`) |
| `introspect-casing` | No | JS key naming strategy: `preserve` or `camel` |
| `tablesFilter` | No | Table name filter |
| `schemaFilter` | No | Schema filter (default: `["public"]`) |
| `extensionsFilters` | No | Extension filters |