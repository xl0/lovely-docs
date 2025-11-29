## Cloudflare D1 Setup

D1 is Cloudflare's queryable relational database. Drizzle ORM fully supports D1 and Cloudflare Workers environment, supporting SQLite-like query methods (`all`, `get`, `values`, `run`).

### Installation
Install `drizzle-orm` and `drizzle-kit` as dev dependency.

### Configuration
Create a `wrangler.json` or `wrangler.toml` file with D1 database binding configuration:

**wrangler.json:**
```json
{
    "name": "YOUR_PROJECT_NAME",
    "main": "src/index.ts",
    "compatibility_date": "2024-09-26",
    "compatibility_flags": ["nodejs_compat"],
    "d1_databases": [
        {
            "binding": "BINDING_NAME",
            "database_name": "YOUR_DB_NAME",
            "database_id": "YOUR_DB_ID",
            "migrations_dir": "drizzle/migrations"
        }
    ]
}
```

**wrangler.toml:**
```toml
name = "YOUR_PROJECT_NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "BINDING_NAME"
database_name = "YOUR_DB_NAME"
database_id = "YOUR_DB_ID"
migrations_dir = "drizzle/migrations"
```

### Basic Query
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all()
    return Response.json(result);
  },
};
```

Initialize the driver by importing from `drizzle-orm/d1`, pass the D1 database binding from the Cloudflare Workers environment, and execute queries using standard Drizzle syntax.