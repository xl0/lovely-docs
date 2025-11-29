## Purpose
`drizzle-kit pull` introspects an existing database and generates a TypeScript Drizzle schema file for database-first approaches.

## Basic Usage
```ts
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: "postgresql://user:password@host:port/dbname" },
});
```
```shell
npx drizzle-kit pull
```

## Configuration Options
- **Required**: `dialect` (database type)
- **Connection**: `url` or individual `user`, `password`, `host`, `port`, `database`
- **Output**: `out` (default: `./drizzle`)
- **Filtering**: `tablesFilter`, `schemaFilter`, `extensionsFilters`
- **Special drivers**: `driver` (aws-data-api, pglite, d1-http)
- **Casing**: `introspect-casing` (preserve or camel)

## Multiple Configs
```shell
npx drizzle-kit pull --config=drizzle-dev.config.ts
npx drizzle-kit pull --config=drizzle-prod.config.ts
```

## Special Drivers
```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: { url: ":memory:" },
});
```

## Filtering
```ts
export default defineConfig({
  schemaFilter: ["public"],
  tablesFilter: ["*"],
  extensionsFilters: ["postgis"],
});
```