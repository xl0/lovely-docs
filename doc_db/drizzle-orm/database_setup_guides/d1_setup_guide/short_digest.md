## Setup Drizzle with Cloudflare D1

Prerequisites: dotenv, tsx, Cloudflare D1, wrangler

1. Install packages
2. Configure wrangler.toml with D1 binding
3. Connect with `drizzle(env.<BINDING_NAME>)`
4. Create schema in src/db/schema.ts
5. Setup drizzle.config.ts with d1-http driver and Cloudflare credentials
6. Apply migrations with Drizzle Kit
7. Query: `db.select().from(users).all()`
8. Run with tsx or wrangler