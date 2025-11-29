## Quick Setup

1. Install: `npm install drizzle-orm postgres` and `npm install -D drizzle-kit`

2. Define schema in `src/schema.ts`:
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

3. Create `drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

4. Add to `package.json`: `"generate": "drizzle-kit generate"` and `"migrate": "drizzle-kit migrate"`

5. Run `npm run generate` to create SQL migrations, then `npm run migrate` to apply them