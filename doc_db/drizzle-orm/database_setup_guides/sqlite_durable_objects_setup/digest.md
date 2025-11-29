## Setup Drizzle ORM with Cloudflare SQLite Durable Objects

### Prerequisites
- dotenv - environment variable management
- tsx - TypeScript file runner
- Cloudflare SQLite Durable Objects - SQLite database embedded in a Durable Object
- wrangler - Cloudflare Developer Platform CLI

### Installation
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit wrangler @cloudflare/workers-types
```

### Configure wrangler.toml
```toml
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyDurableObject"]

[[rules]] 
type = "Text"
globs = ["**/*.sql"]
fallthrough = true
```

### Connect Drizzle to Database
```typescript
import { drizzle, type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });
	}
}
```

### Generate Wrangler Types
```bash
npx wrangler types
```
Outputs `worker-configuration.d.ts` file.

### Create Table Schema
Define your schema in `src/db/schema.ts` (details in referenced component).

### Configure Drizzle
Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'durable-sqlite',
});
```

### Generate and Apply Migrations
```bash
npx drizzle-kit generate
```

Add migration functionality to MyDurableObject:
```typescript
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';

export class MyDurableObject extends DurableObject {
	// ... existing code ...

	async migrate() {
		migrate(this.db, migrations);
	}
}
```

### Query Database
```typescript
import { usersTable } from './db/schema';

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });

		// Block concurrency until migrations complete
		ctx.blockConcurrencyWhile(async () => {
			await this._migrate();
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.insert(user);
		return this.select();
	}

	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}

	async select() {
		return this.db.select().from(usersTable);
	}

	async _migrate() {
		migrate(this.db, migrations);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		// Option A - Maximum performance: bundle all DB interactions in single DO call
		const usersAll = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});

		// Option B - Slower but useful for debugging: individual query calls
		await stub.insert({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		const users = await stub.select();

		return Response.json(users);
	}
}
```

### Key Points
- Migrations can only be applied from Cloudflare Workers
- Use `ctx.blockConcurrencyWhile()` to ensure migrations complete before accepting queries
- Bundle database interactions within single Durable Object calls for maximum performance
- Each individual query call is a round-trip to the Durable Object instance