**Drizzle Kit** is a CLI tool for managing SQL database migrations with Drizzle ORM.

## Installation
```
npm install -D drizzle-kit
```

## Core Commands

- **drizzle-kit generate**: Generates SQL migration files based on your Drizzle schema, either on initial declaration or subsequent changes
- **drizzle-kit migrate**: Applies generated SQL migration files to your database
- **drizzle-kit push**: Pushes your Drizzle schema directly to the database without generating migration files
- **drizzle-kit pull**: Introspects database schema, converts it to Drizzle schema format, and saves it to your codebase
- **drizzle-kit studio**: Connects to your database and spins up a proxy server for Drizzle Studio for convenient database browsing
- **drizzle-kit check**: Walks through all generated migrations and checks for race conditions/collisions
- **drizzle-kit up**: Upgrades snapshots of previously generated migrations

## Configuration

Drizzle Kit is configured via `drizzle.config.ts` file or CLI parameters. Minimum required configuration:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Extended configuration example:
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
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

You can specify different config files via CLI for managing multiple database stages or environments:
```
drizzle-kit push --config=drizzle-dev.config.ts
drizzle-kit push --config=drizzle-prod.config.ts
```

Required configuration: SQL `dialect` and `schema` path must be provided for Drizzle Kit to generate migrations.