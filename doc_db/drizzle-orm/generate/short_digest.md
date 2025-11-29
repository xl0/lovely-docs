## Purpose
`drizzle-kit generate` creates SQL migrations from Drizzle schema definitions by comparing current schema against previous snapshots.

## Basic Usage
```ts
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit generate
```

## Key Features
- **Schema files**: Single or multiple files with glob patterns
- **Custom names**: `--name=init` creates `0000_init.sql`
- **Multiple configs**: `--config=drizzle-dev.config.ts` for different stages
- **Custom migrations**: `--custom --name=seed-users` for manual SQL

## Configuration Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect |
| `schema` | Yes | Path to schema file(s) |
| `out` | No | Output folder, default `./drizzle` |
| `config` | No | Config file path |
| `breakpoints` | No | SQL breakpoints, default `true` |
| `custom` | No | Generate empty migration |
| `name` | No | Custom migration name |