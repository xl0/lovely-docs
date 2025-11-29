## Purpose
`drizzle-kit check` validates SQL migrations history consistency, useful for team environments with multiple developers on different branches.

## Configuration
Requires `dialect` and database credentials via `drizzle.config.ts` or CLI:
```ts
// drizzle.config.ts
export default defineConfig({ dialect: "postgresql" });
```
```shell
npx drizzle-kit check
# or via CLI
npx drizzle-kit check --dialect=postgresql
```

## Multiple Configs & Options
Support for multiple config files (`--config=drizzle-dev.config.ts`). CLI options: `dialect` (required), `out` (default `./drizzle`), `config` (default `drizzle.config.ts`).