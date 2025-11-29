## Purpose
`drizzle-kit check` validates consistency of generated SQL migrations history. Essential for team environments where multiple developers work on different branches and alter the database schema independently.

## Configuration
The command requires `dialect` and database connection credentials, provided via either `drizzle.config.ts` or CLI options.

**Via config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit check
```

**Via CLI:**
```shell
npx drizzle-kit check --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in a single project for different database stages or multiple databases:
```shell
npx drizzle-kit check --config=drizzle-dev.config.ts
npx drizzle-kit check --config=drizzle-prod.config.ts
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | No | Migrations folder path (default: `./drizzle`) |
| `config` | No | Configuration file path (default: `drizzle.config.ts`) |

**Examples:**
```shell
npx drizzle-kit check --dialect=postgresql
npx drizzle-kit check --dialect=postgresql --out=./migrations-folder
```