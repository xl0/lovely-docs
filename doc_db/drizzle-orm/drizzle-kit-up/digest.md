## Purpose
`drizzle-kit up` upgrades drizzle schema snapshots to a newer version. It's required when breaking changes are introduced to JSON snapshots and the internal version is updated.

## Configuration
The command requires `dialect` and database connection credentials, provided via `drizzle.config.ts` or CLI options.

**With config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit up
```

**As CLI options:**
```shell
npx drizzle-kit up --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in one project for different database stages or databases:
```shell
npx drizzle-kit migrate --config=drizzle-dev.config.ts
npx drizzle-kit migrate --config=drizzle-prod.config.ts
```

Project structure example:
```
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | no | Migrations folder, default: `./drizzle` |
| `config` | no | Configuration file path, default: `drizzle.config.ts` |

**Examples:**
```shell
npx drizzle-kit up --dialect=postgresql
npx drizzle-kit up --dialect=postgresql --out=./migrations-folder
```