## `drizzle-kit push`

Pushes schema directly to database without generating SQL files (code-first migrations).

**Configuration via drizzle.config.ts:**
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

**Or via CLI:**
```shell
npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=postgresql://user:password@host:port/dbname
```

**Key options:**
- `dialect` (required): Database type
- `schema` (required): Path to schema file(s) with glob support
- `driver`: For exceptions like aws-data-api, pglight, d1-http
- `tablesFilter`, `schemaFilter`, `extensionsFilters`: Filter what to manage
- `--verbose`, `--strict`, `--force`: CLI-only options

**Multiple config files:**
```shell
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

**Filtering example:**
```ts
extensionsFilters: ["postgis"],
schemaFilter: ["public"],
tablesFilter: ["*"],
```

**Note:** Expo SQLite and OP SQLite don't support push - use embedded migrations instead.