**Drizzle Kit** is a CLI tool for SQL migrations. Install with `npm install -D drizzle-kit`.

Core commands: `generate` (create migrations), `migrate` (apply migrations), `push` (direct schema push), `pull` (introspect schema), `studio` (database UI), `check` (detect migration collisions), `up` (upgrade snapshots).

Configure via `drizzle.config.ts` with required `dialect` and `schema` path:
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Use `--config` flag for multiple environments: `drizzle-kit push --config=drizzle-prod.config.ts`