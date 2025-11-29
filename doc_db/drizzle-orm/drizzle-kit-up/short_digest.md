## Purpose
`drizzle-kit up` upgrades schema snapshots to newer versions when breaking changes are introduced.

## Configuration
Requires `dialect` and database credentials via config file or CLI:
```ts
// drizzle.config.ts
export default defineConfig({ dialect: "postgresql" });
```
```shell
npx drizzle-kit up
# or
npx drizzle-kit up --dialect=postgresql
```

## Multiple Configs
```shell
npx drizzle-kit migrate --config=drizzle-dev.config.ts
npx drizzle-kit migrate --config=drizzle-prod.config.ts
```

## CLI Options
- `dialect` (required): `postgresql`, `mysql`, or `sqlite`
- `out`: migrations folder, default `./drizzle`
- `config`: config file path, default `drizzle.config.ts`