## Installation

Install `drizzle-orm` and `drizzle-kit`:
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

## Schema Definition

Create `src/schema.ts` to define your database tables:
```ts
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
```

## Configuration

Create `drizzle.config.ts` at project root:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

## Migration Setup

Add scripts to `package.json`:
```json
{
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate"
  }
}
```

## Generate and Run Migrations

Generate SQL migration files:
```shell
npm run generate
```

This creates migration files in the `drizzle/` directory (e.g., `drizzle/0000_pale_mister_fear.sql`).

Run migrations to apply schema to database:
```shell
npm run migrate
```