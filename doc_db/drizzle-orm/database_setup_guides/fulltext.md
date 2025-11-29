

## Pages

### bun-sql-existing
Integrate Drizzle ORM with Bun SQL for existing PostgreSQL: install drizzle-orm/dotenv/drizzle-kit, set DATABASE_URL env var, configure drizzle.config.ts with postgresql dialect, introspect existing database, transfer schema, connect via Bun SQL, query with bun src/index.ts (note: Bun 1.2.0 has concurrent query issues).

## Setup Drizzle ORM with Bun SQL in an existing PostgreSQL project

### Prerequisites
- **dotenv** - for managing environment variables
- **bun** - JavaScript all-in-one toolkit
- **Bun SQL** - native bindings for PostgreSQL databases

### Important Note
Bun version 1.2.0 has issues with concurrent statement execution that may cause errors when running multiple queries simultaneously. This is tracked in a GitHub issue and should be resolved in future versions.

### Installation Steps

**Step 1: Install packages**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit @types/bun
```

**Step 2: Setup environment variables**
Create a `.env` file with `DATABASE_URL` pointing to your PostgreSQL database.

**Step 3: Setup Drizzle config**
Create a `drizzle.config.ts` file with dialect set to `postgresql` and reference the `DATABASE_URL` environment variable.

**Step 4: Introspect your database**
Run introspection to generate schema from existing PostgreSQL database.

**Step 5: Transfer introspected code**
Move the generated schema code to your actual schema file.

**Step 6: Connect Drizzle ORM to the database**
Setup the database connection using Bun SQL bindings.

**Step 7: Query the database**
Write queries using the Drizzle ORM API with Bun SQL dialect and `DATABASE_URL` environment variable.

**Step 8: Run the script**
```bash
bun src/index.ts
```

**Step 9 (Optional): Update table schema**
Modify your schema definitions as needed.

**Step 10 (Optional): Apply changes to database**
Run migrations to apply schema changes to the database.

**Step 11 (Optional): Query with new fields**
Test queries against the updated schema with new fields.

### getting_started_with_bun:sqlite
Step-by-step setup guide for Drizzle ORM with Bun:SQLite including package installation, environment configuration, schema creation, migrations, and database querying; Bun 1.2.0 has concurrent query limitations.

## Setup Steps

1. **Install packages**: `drizzle-orm`, `-D drizzle-kit @types/bun`

2. **Setup connection variables**: Configure `DATABASE_URL` environment variable

3. **Connect Drizzle ORM to database**: Use ConnectBun component to establish connection

4. **Create a table**: Define your database schema

5. **Setup Drizzle config file**: Configure with `dialect='postgresql'` and `DATABASE_URL` environment variable

6. **Apply changes to database**: Run migrations to sync schema

7. **Seed and Query the database**: Use bun-sql dialect with `DATABASE_URL` for database operations

8. **Run the script**: Execute with `bun src/index.ts`

## Prerequisites
- **bun**: JavaScript all-in-one toolkit
- **Bun SQL**: Native bindings for PostgreSQL databases

## Important Note
Bun version 1.2.0 has issues with concurrent statement execution that may cause errors when running multiple queries simultaneously. This is tracked in a GitHub issue and should be resolved in future versions.

### bun-sqlite-existing
Setup Drizzle ORM with Bun's native SQLite driver for existing projects: install packages, configure environment and drizzle.config.ts, introspect database, connect, and query via bun CLI.

## Setup Drizzle ORM with Bun and SQLite in an existing project

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **bun** - JavaScript all-in-one toolkit
- **bun:sqlite** - native high-performance SQLite3 driver

### Installation
Install packages:
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit tsx @types/bun
```

### Configuration

1. **Environment variables** - Create `.env` file with database file path:
```plaintext
DB_FILE_NAME=mydb.sqlite
```

2. **Drizzle config** - Setup `drizzle.config.ts` with SQLite dialect and environment variable reference

3. **Database introspection** - Run introspection to generate schema from existing database

4. **Schema file** - Transfer introspected code to your schema file

### Connection Setup
Connect Drizzle ORM to Bun SQLite database using the configured connection

### Usage

Query the database with generated schema:
```bash
bun src/index.ts
```

### Optional: Schema Updates
- Update table schema definitions
- Apply changes to database
- Query database with new fields

### bun_sqlite_setup
Step-by-step setup for Drizzle ORM with Bun's native SQLite driver: install packages, configure DB_FILE_NAME env var, connect to database, define schema, setup drizzle config, apply migrations, seed/query data, run with bun.

## Getting Started with Drizzle ORM and Bun:SQLite

### Prerequisites
- **bun** - JavaScript all-in-one toolkit
- **bun:sqlite** - native high-performance SQLite3 driver

### Installation
Install required packages:
```
npm install drizzle-orm
npm install -D drizzle-kit @types/bun
```

### Setup Connection Variables
Create environment variable for database file location:
```
DB_FILE_NAME=mydb.sqlite
```

### Connect to Database
Use Drizzle ORM to establish connection to bun:sqlite database.

### Create Tables
Define your database schema using Drizzle ORM table definitions.

### Configure Drizzle
Setup drizzle.config.ts with SQLite dialect and DB_FILE_NAME environment variable.

### Apply Migrations
Run migrations to apply schema changes to the database.

### Seed and Query
Write queries to seed initial data and query the database using Drizzle ORM.

### Run Application
Execute your script with:
```bash
bun src/index.ts
```

### d1_setup_guide
Step-by-step setup for Drizzle with Cloudflare D1: install packages, configure wrangler.toml with D1 binding, connect via drizzle(env.DB), define schema, setup drizzle.config.ts with d1-http driver and Cloudflare credentials, apply migrations, query with db.select().from(table).all().

## Prerequisites
- dotenv: package for managing environment variables
- tsx: package for running TypeScript files
- Cloudflare D1: Serverless SQL database for Workers and Pages projects
- wrangler: Cloudflare Developer Platform CLI

## Setup Steps

**Step 1: Install packages**
Install drizzle-orm and required dependencies.

**Step 2: Configure wrangler.toml**
Create wrangler.toml with D1 database binding:
```toml
name = "YOUR PROJECT NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "DB"
database_name = "YOUR DB NAME"
database_id = "YOUR DB ID"
migrations_dir = "drizzle"
```

**Step 3: Connect Drizzle to D1**
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
  },
};
```

**Step 4: Create a table**
Define your schema in src/db/schema.ts.

**Step 5: Setup drizzle.config.ts**
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```
Requires CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_D1_TOKEN environment variables.

**Step 6: Apply migrations**
Run Drizzle Kit to apply schema changes to the database.

**Step 7: Query the database**
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

**Step 8: Run the application**
Execute the index.ts file using tsx or wrangler.

### sqlite_durable_objects_setup
Setup Drizzle ORM with Cloudflare SQLite Durable Objects: install packages, configure wrangler.toml with DO binding, connect via drizzle(storage), generate migrations with drizzle-kit, apply migrations in constructor with blockConcurrencyWhile, query via insert/select methods, access from Worker via DO stub.

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

### expo_setup
Step-by-step guide to integrate Drizzle ORM with Expo SQLite: project setup, database connection, schema definition, configuration files (drizzle, metro, babel), migration generation, CRUD operations with useMigrations hook, and running the app.

## Setup Drizzle ORM with Expo SQLite

### Prerequisites
- Expo SQLite library for database access via SQLite API

### Project Setup
1. Create new Expo project with TypeScript template:
   ```bash
   npx create-expo-app --template blank-typescript
   ```

2. Install Expo SQLite:
   ```bash
   npx expo install expo-sqlite
   ```

3. Install Drizzle packages:
   ```bash
   npm install drizzle-orm
   npm install -D drizzle-kit
   ```

### Database Connection
Create connection in `App.tsx`:
```ts
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);
```

### Schema Definition
Create `db/schema.ts`:
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

### Configuration Files

**drizzle.config.ts** (root):
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

**metro.config.js** (root):
```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**babel.config.js** (root):
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

### Migrations
Generate migrations:
```bash
npx drizzle-kit generate
```

### Database Operations
In `App.tsx`, use `useMigrations` hook to apply migrations, then perform CRUD operations:
```ts
import { Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;

    (async () => {
      await db.delete(usersTable);
      await db.insert(usersTable).values([
        { name: 'John', age: 30, email: 'john@example.com' }
      ]);
      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  if (!items?.length) return <View><Text>Empty</Text></View>;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((item) => <Text key={item.id}>{item.email}</Text>)}
    </View>
  );
}
```

### Run Application
```bash
npx expo run:ios
# or: yarn expo run:ios, pnpm expo run:ios, bun expo run:ios
```

### Project Structure
```
📦 project root
 ├ 📂 drizzle (migrations)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 ├ 📜 App.tsx
 └ 📜 package.json
```

### gel_in_existing_project
Setup Drizzle with Gel: install packages, configure dialect as 'gel', pull schema with drizzle-kit, create client and drizzle instance, query with standard ORM methods.

## Setup Drizzle ORM with Gel in an existing project

**Prerequisites:**
- tsx package for running TypeScript files
- gel-js package for querying Gel database

**Step 1: Install packages**
```
npm install drizzle-orm gel
npm install -D drizzle-kit tsx
```

**Step 2: Create drizzle.config.ts**
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
});
```

**Step 3: Pull database schema**
Run `npx drizzle-kit pull` to generate schema from your Gel database. This creates a schema.ts file with table definitions using gelTable, uuid, smallint, text, and other Gel-specific types.

Example generated schema:
```typescript
import { gelTable, uniqueIndex, uuid, smallint, text } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const users = gelTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	age: smallint(),
	email: text().notNull(),
	name: text(),
}, (table) => [
	uniqueIndex("a8c6061c-f37f-11ef-9249-0d78f6c1807b;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
```

**Step 4: Initialize database connection**
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const gelClient = createClient();
const db = drizzle({ client: gelClient });
```

**Step 5: Query the database**
```typescript
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
import { users } from "../drizzle/schema";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

async function main() {
  const user = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(users).values(user);
  console.log("New user created!");

  const usersResponse = await db.select().from(users);
  console.log("Getting all users from the database: ", usersResponse);

  await db
    .update(users)
    .set({ age: 31 })
    .where(eq(users.email, user.email));
  console.log("User info updated!");

  await db.delete(users).where(eq(users.email, user.email));
  console.log("User deleted!");
}

main();
```

**Step 6: Run the file**
Execute with tsx: `npx tsx src/index.ts`

### getting_started_with_gel
Initialize Gel project with schema, install drizzle-orm and drizzle-kit, configure dialect, pull schema types, connect with createClient(), perform CRUD operations.

## Setup and Installation

Initialize a Gel project and define a basic schema in `dbschema/default.esdl`:
```esdl
module default {
    type user {
        name: str;
        required email: str;
        age: int16;
    }
}
```

Create and apply Gel migrations:
```bash
gel migration create
gel migration apply
```

Install required packages:
```bash
npm install drizzle-orm gel
npm install -D drizzle-kit tsx
```

## Configuration

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
});
```

Pull the database schema to generate Drizzle types:
```bash
npx drizzle-kit pull
```

This generates `drizzle/schema.ts` with table definitions like:
```typescript
import { gelTable, uniqueIndex, uuid, smallint, text } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const users = gelTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	age: smallint(),
	email: text().notNull(),
	name: text(),
}, (table) => [
	uniqueIndex("a8c6061c-f37f-11ef-9249-0d78f6c1807b;schemaconstr").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
```

## Database Connection

Create `src/index.ts` and initialize the connection:
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const gelClient = createClient();
const db = drizzle({ client: gelClient });
```

## Basic Operations

Insert, select, update, and delete records:
```typescript
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
import { users } from "../drizzle/schema";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

async function main() {
  const user: typeof users.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(users).values(user);
  const usersResponse = await db.select().from(users);
  
  await db
    .update(users)
    .set({ age: 31 })
    .where(eq(users.email, user.email));
  
  await db.delete(users).where(eq(users.email, user.email));
}

main();
```

Run with `tsx src/index.ts`.

### mysql_existing_project_setup
Integrate Drizzle ORM into existing MySQL project: install mysql2, set DATABASE_URL env var, configure drizzle.config.ts, introspect database, transfer schema, connect with mysql2 driver, query with Drizzle, run with tsx, optionally update schema and apply migrations.

## Setup Drizzle ORM with MySQL in an Existing Project

This guide walks through integrating Drizzle ORM into an existing MySQL project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - for querying MySQL database

### Step-by-Step Process

1. **Install mysql2 package** - Required driver for MySQL connections

2. **Setup connection variables** - Configure DATABASE_URL environment variable in .env file

3. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'mysql' and reference the DATABASE_URL environment variable

4. **Introspect your database** - Use Drizzle's introspection tool to analyze your existing MySQL database schema

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Establish connection using mysql2 driver with the DATABASE_URL

7. **Query the database** - Write and execute queries using Drizzle ORM with mysql2 dialect

8. **Run index.ts file** - Execute your TypeScript file using tsx

9. **Update table schema (optional)** - Modify existing table definitions as needed

10. **Apply changes to database (optional)** - Use migrations to apply schema changes to the database

11. **Query database with new field (optional)** - Test queries against updated schema with new columns

### mysql_setup
Step-by-step setup for MySQL with Drizzle: install mysql2, configure DATABASE_URL, connect via drizzle-orm/mysql2, define schema, create config with dialect='mysql', migrate, seed/query, run.

## MySQL Setup with Drizzle ORM

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- mysql2 - MySQL client for Node.js with performance focus

**Driver:** Use `mysql2` driver with `drizzle-orm/mysql2` package for native support.

**Setup Steps:**

1. **Install mysql2 package** - Add the MySQL client dependency to your project

2. **Setup connection variables** - Configure DATABASE_URL environment variable with your MySQL connection string

3. **Connect Drizzle ORM to database** - Initialize Drizzle connection using the mysql2 driver and DATABASE_URL

4. **Create a table** - Define your database schema using Drizzle table definitions

5. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'mysql' and DATABASE_URL reference

6. **Apply changes to database** - Run migrations to create tables in your MySQL database

7. **Seed and Query the database** - Insert test data and execute queries using Drizzle ORM with mysql2 driver

8. **Run index.ts file** - Execute your TypeScript application file

**Note:** If you don't have a MySQL database yet, you can set up MySQL in Docker using the provided guide to generate a database URL.

### neon-existing
11-step guide to integrate Drizzle ORM with Neon serverless PostgreSQL in existing projects: install driver, configure DATABASE_URL, introspect existing schema, connect client, query, and optionally apply schema changes.

## Setup Drizzle ORM with Neon in an existing project

This guide walks through integrating Drizzle ORM with a Neon serverless PostgreSQL database in an existing project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Neon** - serverless Postgres platform

### Installation & Configuration Steps

1. **Install @neondatabase/serverless package** - the Neon driver for Drizzle
2. **Setup connection variables** - configure DATABASE_URL environment variable with your Neon connection string
3. **Setup Drizzle config file** - create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference
4. **Introspect your database** - use `drizzle-kit introspect:pg` to generate schema from existing database tables
5. **Transfer code to schema file** - move the introspected schema to your actual schema file (typically src/schema.ts)
6. **Connect Drizzle ORM to database** - initialize Drizzle client using Neon's HTTP driver with your DATABASE_URL
7. **Query the database** - write and execute queries using Drizzle's query builder
8. **Run index.ts file** - execute your TypeScript file with tsx to test the connection and queries
9. **Update table schema (optional)** - modify your schema.ts file to add new columns or tables
10. **Apply changes to database (optional)** - run migrations with `drizzle-kit push:pg` to update the database
11. **Query with new fields (optional)** - update queries to use newly added schema fields

The workflow follows: install driver → configure environment → introspect existing schema → connect client → query → optionally modify schema and apply changes.

### getting_started_with_neon
Step-by-step setup for Drizzle ORM with Neon serverless Postgres: install @neondatabase/serverless, configure DATABASE_URL, connect driver, define schema, setup drizzle.config.ts with postgresql dialect, apply migrations, seed/query, run with tsx.

## Setup Drizzle ORM with Neon Serverless Postgres

Drizzle ORM provides native support for Neon connections using `neon-http` and `neon-websockets` drivers, which use the neon-serverless driver under the hood.

**Driver Selection:**
- `neon-http`: Query over HTTP, faster for single non-interactive transactions, suitable for serverless environments
- `neon-websockets`: WebSocket-based driver for session and interactive transaction support
- `neon-serverless`: Full drop-in replacement for the `pg` driver with WebSocket support
- For direct Postgres connections, use the standard PostgreSQL setup instead

**Setup Steps:**

1. Install the `@neondatabase/serverless` package
2. Set up `DATABASE_URL` environment variable with your Neon connection string
3. Connect Drizzle ORM to the database using the Neon driver
4. Define your database schema with tables
5. Create and configure a `drizzle.config.ts` file with `dialect: 'postgresql'` and your `DATABASE_URL`
6. Run migrations to apply schema changes to the database
7. Seed the database and write queries using Drizzle ORM
8. Execute your TypeScript files using tsx

**Prerequisites:** dotenv package for environment variables, tsx for running TypeScript, and a Neon account with serverless Postgres platform access.

### nile_existing_project_setup
Integrate Drizzle with Nile multi-tenant PostgreSQL: install pg, set NILEDB_URL, introspect with `drizzle-kit pull`, connect and query; supports Nile built-in tables and schema updates.

Step-by-step guide to integrate Drizzle ORM with Nile (PostgreSQL re-engineered for multi-tenant apps) in an existing project.

**Prerequisites**: dotenv, tsx, and Nile account.

**Installation**: Install `pg` package and `@types/pg` as dev dependency.

**Configuration**: Set `NILEDB_URL` environment variable and configure Drizzle with `dialect: 'postgresql'` pointing to this variable.

**Database Introspection**: Run `npx drizzle-kit pull` to generate `schema.ts`, migrations, and `relations.ts` files from existing database. Nile includes built-in tables like `tenants` that are automatically included in introspection.

**Example Generated Schema**:
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenants = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```

**Connection**: Connect to Nile database using the generated schema.

**Schema Updates**: Modify `schema.ts` to add new columns (e.g., `deadline: timestamp({ mode: 'string' })`), then apply changes to database and re-run queries to see updated fields.

**Workflow**: Install packages → setup env variables → configure Drizzle → introspect database → transfer code to schema file → connect to database → query → optionally update schema and apply changes.

### getting_started_with_nile
Step-by-step setup for Drizzle with Nile PostgreSQL: install pg, configure NILEDB_URL env var, define multi-tenant schema with tenant_id columns, setup drizzle.config.ts, apply migrations.

## Getting Started with Nile

Complete setup guide for using Drizzle ORM with Nile, a PostgreSQL database re-engineered for multi-tenant applications.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Nile** - PostgreSQL re-engineered for multi-tenant apps

### Installation & Setup

**Step 1: Install postgres package**
```bash
npm install pg
npm install -D @types/pg
```

**Step 2: Setup connection variables**
Create a `.env` file with `NILEDB_URL` environment variable containing your Nile database connection string.

**Step 3: Connect Drizzle ORM to the database**
Use the `NILEDB_URL` environment variable to establish a connection to your Nile database.

**Step 4: Create a schema**
Define your tables in `src/db/schema.ts`. Nile is designed for multi-tenant apps, so schemas typically include tenant-aware tables with `tenant_id` columns:

```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenantsTable = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```

**Step 5: Setup Drizzle config file**
Create a `drizzle.config.ts` file with PostgreSQL dialect and `NILEDB_URL` environment variable reference.

**Step 6: Apply changes to the database**
Run migrations to apply schema changes to your Nile database.

**Step 7: Seed and Query the database**
Populate and query your database using Drizzle ORM.

**Step 8: Run your application**
Execute your TypeScript files using tsx.

### op-sqlite_setup_guide
Step-by-step setup for Drizzle ORM with OP-SQLite in Expo React Native: create project, install packages, configure Metro/Babel, define schema, generate migrations, apply migrations with useMigrations hook, and perform database operations.

## Getting Started with Drizzle ORM and OP-SQLite

OP-SQLite is a SQLite library for React Native. This guide covers setting up a new Expo project with Drizzle ORM and OP-SQLite for database operations.

### Prerequisites
- OP-SQLite library installed (see GitHub: OP-Engineering/op-sqlite)

### Project Setup

1. **Create Expo project** with TypeScript template:
   ```bash
   npx create-expo-app --template blank-typescript
   ```

2. **Install packages**:
   ```bash
   npm install drizzle-orm @op-engineering/op-sqlite
   npm install -D drizzle-kit
   ```

3. **Initialize database connection** in `App.tsx`:
   ```typescript
   import { open } from '@op-engineering/op-sqlite';
   import { drizzle } from 'drizzle-orm/op-sqlite';
   
   const opsqliteDb = open({ name: 'db' });
   const db = drizzle(opsqliteDb);
   ```

4. **Define schema** in `db/schema.ts`:
   ```typescript
   import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
   
   export const usersTable = sqliteTable("users_table", {
     id: int().primaryKey({ autoIncrement: true }),
     name: text().notNull(),
     age: int().notNull(),
     email: text().notNull().unique(),
   });
   ```

5. **Create Drizzle config** (`drizzle.config.ts`):
   ```typescript
   import { defineConfig } from 'drizzle-kit';
   
   export default defineConfig({
     dialect: 'sqlite',
     driver: 'expo',
     schema: './db/schema.ts',
     out: './drizzle',
   });
   ```

6. **Configure Metro bundler** (`metro.config.js`):
   ```javascript
   const { getDefaultConfig } = require('expo/metro-config');
   const config = getDefaultConfig(__dirname);
   config.resolver.sourceExts.push('sql');
   module.exports = config;
   ```

7. **Update Babel config** (`babel.config.js`):
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [["inline-import", { "extensions": [".sql"] }]]
     };
   };
   ```

8. **Generate migrations**:
   ```bash
   npx drizzle-kit generate
   ```

9. **Apply migrations and perform database operations** in `App.tsx`:
   ```typescript
   import { Text, View } from 'react-native';
   import { open } from '@op-engineering/op-sqlite';
   import { useEffect, useState } from 'react';
   import { drizzle } from 'drizzle-orm/op-sqlite';
   import { usersTable } from './db/schema';
   import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
   import migrations from './drizzle/migrations';
   
   const opsqliteDb = open({ name: 'db' });
   const db = drizzle(opsqliteDb);
   
   export default function App() {
     const { success, error } = useMigrations(db, migrations);
     const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);
   
     useEffect(() => {
       if (!success) return;
   
       (async () => {
         await db.delete(usersTable);
         await db.insert(usersTable).values([
           { name: 'John', age: 30, email: 'john@example.com' }
         ]);
         const users = await db.select().from(usersTable);
         setItems(users);
       })();
     }, [success]);
   
     if (error) return <View><Text>Migration error: {error.message}</Text></View>;
     if (!success) return <View><Text>Migration in progress...</Text></View>;
     if (!items?.length) return <View><Text>Empty</Text></View>;
   
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         {items.map((item) => <Text key={item.id}>{item.email}</Text>)}
       </View>
     );
   }
   ```

10. **Run the app**:
    ```bash
    npx expo run:ios  # or yarn/pnpm/bun
    ```

### Project Structure
```
📦 project root
 ├ 📂 drizzle (migrations and snapshots)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 App.tsx
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 └ 📜 package.json
```

### pglite-existing
Step-by-step integration of Drizzle ORM with PGLite driver for existing projects: install @electric-sql/pglite, configure DATABASE_URL and drizzle.config.ts, introspect existing database, connect via PGLite driver, query with Drizzle ORM, optionally update schema and apply migrations.

## Setup Drizzle ORM with PGLite in an Existing Project

This guide walks through integrating Drizzle ORM with PGLite (ElectricSQL's PostgreSQL implementation) into an existing project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **ElectricSQL** - the organization behind PGLite
- **pglite driver** - the PostgreSQL implementation package

### Installation & Configuration Steps

**Step 1: Install packages**
Install `@electric-sql/pglite` along with Drizzle ORM.

**Step 2: Setup connection variables**
Configure `DATABASE_URL` environment variable for database connection.

**Step 3: Setup Drizzle config file**
Create drizzle.config.ts with PostgreSQL dialect and reference the `DATABASE_URL` environment variable.

**Step 4: Introspect your database**
Run introspection to automatically generate schema files from existing database structure.

**Step 5: Transfer code to schema file**
Move the introspected schema code into your actual schema file (typically `src/schema.ts`).

**Step 6: Connect Drizzle ORM to the database**
Establish connection using PGLite driver with the configured database URL.

**Step 7: Query the database**
Write and execute queries against the connected database using Drizzle ORM query builder.

**Step 8: Run index.ts file**
Execute your TypeScript file using tsx to test the setup.

**Step 9: Update table schema (optional)**
Modify table definitions in your schema file as needed.

**Step 10: Apply changes to database (optional)**
Run migrations to apply schema changes to the database.

**Step 11: Query with new fields (optional)**
Test queries using newly added schema fields.

### pglite_setup
Step-by-step setup for Drizzle ORM with PGlite: install @electric-sql/pglite, configure DATABASE_URL, connect Drizzle, define schema, setup drizzle.config.ts with PostgreSQL dialect, apply migrations, seed/query, run with tsx.

## Getting Started with PGlite

This guide walks through setting up Drizzle ORM with PGlite, a PostgreSQL database that runs in-process.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **ElectricSQL** - the organization behind PGlite
- **pglite driver** - the PostgreSQL driver for PGlite

### Setup Steps

1. **Install packages**: Install `@electric-sql/pglite` along with Drizzle ORM
2. **Setup connection variables**: Configure `DATABASE_URL` environment variable
3. **Connect to database**: Initialize Drizzle ORM connection to PGlite
4. **Create a table**: Define your database schema using Drizzle ORM table definitions
5. **Setup Drizzle config file**: Create `drizzle.config.ts` with PostgreSQL dialect and `DATABASE_URL` reference
6. **Apply migrations**: Run Drizzle migrations to create tables in the database
7. **Seed and query**: Write TypeScript code to insert data and query the database using PGlite dialect
8. **Run the file**: Execute the TypeScript file using tsx

The guide includes file structure setup and covers the complete workflow from installation through querying the database.

### planetscale_existing_project_setup
Integrate Drizzle ORM with PlanetScale using database-js driver: install package, set DATABASE_URL env vars, create MySQL config, introspect existing schema, connect with host/username/password, perform CRUD operations.

## Setup Drizzle ORM with PlanetScale in an Existing Project

This guide covers integrating Drizzle ORM with PlanetScale (MySQL database platform) using the `database-js` serverless driver for HTTP connections.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file execution
- **PlanetScale** - MySQL database platform
- **database-js** - PlanetScale serverless driver

### Important Note
This tutorial uses the `database-js` driver for HTTP calls to PlanetScale. For TCP connections, refer to the MySQL Get Started guide instead.

### Setup Steps

1. **Install Package**: Install `@planetscale/database`

2. **Setup Connection Variables**: Configure `DATABASE_URL` environment variable

3. **Setup Drizzle Config**: Create drizzle config file with MySQL dialect and `DATABASE_URL` reference

4. **Introspect Database**: Run introspection to generate schema from existing database

5. **Transfer Code**: Move introspected schema to actual schema file

6. **Connect Drizzle ORM**: Initialize Drizzle with PlanetScale connection using host, username, and password from environment

7. **Query Database**: Execute queries against the database

8. **Run Application**: Execute the index.ts file

### Optional Schema Updates

9. **Update Table Schema**: Modify table definitions (e.g., add new fields like `phone`)

10. **Apply Changes**: Run migrations to update database schema

11. **Query with New Fields**: Execute queries using updated schema

### Example - Full CRUD Operations
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle({ connection: {
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
    }});

  // Create
  const user = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
    phone: '123-456-7890',
  };
  await db.insert(usersTable).values(user);

  // Read
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```

### planetscale_setup_guide
Step-by-step setup for Drizzle ORM with PlanetScale using HTTP-based database-js driver: install @planetscale/database, configure .env with credentials, connect Drizzle, define schema, setup config with MySQL dialect, apply migrations, seed/query data.

## Getting Started with Drizzle ORM and PlanetScale

This guide walks through setting up Drizzle ORM with PlanetScale, a MySQL database platform, using the HTTP-based `database-js` driver for serverless connections.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **PlanetScale** - MySQL database platform
- **database-js** - PlanetScale serverless driver for HTTP calls

### Important Note
This tutorial uses the `database-js` driver for HTTP calls to PlanetScale. For TCP connections to PlanetScale, refer to the MySQL setup guide instead.

### Setup Steps

1. **Install @planetscale/database package** - Add the PlanetScale database driver to your project

2. **Setup connection variables** - Create a `.env` file with:
   ```
   DATABASE_HOST=
   DATABASE_USERNAME=
   DATABASE_PASSWORD=
   ```
   Get these values from PlanetScale's serverless driver documentation

3. **Connect Drizzle ORM to the database** - Configure the connection using the environment variables

4. **Create a table** - Define your database schema

5. **Setup Drizzle config file** - Configure Drizzle with MySQL dialect and DATABASE_URL environment variable

6. **Apply changes to the database** - Run migrations to create tables

7. **Seed and Query the database** - Populate and retrieve data

8. **Run index.ts file** - Execute your TypeScript application

### postgresql_existing_project_setup
Integrate Drizzle ORM into existing PostgreSQL project: install pg/@types/pg, set DATABASE_URL, configure drizzle.config.ts, introspect existing database, transfer schema, connect driver, query database.

Step-by-step guide to integrate Drizzle ORM into an existing PostgreSQL project.

**Prerequisites:**
- dotenv: manage environment variables
- tsx: run TypeScript files
- node-postgres: query PostgreSQL database

**Setup Steps:**

1. Install node-postgres package and its TypeScript types:
   ```
   npm install pg
   npm install -D @types/pg
   ```

2. Configure DATABASE_URL environment variable in .env file

3. Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference

4. Run introspection to generate schema from existing database:
   ```
   drizzle-kit introspect:pg
   ```

5. Transfer introspected schema code to your actual schema file (typically src/schema.ts)

6. Connect Drizzle ORM to database using node-postgres driver with DATABASE_URL

7. Query the database using Drizzle ORM methods

8. Execute index.ts file to test queries

9. (Optional) Update table schema definitions as needed

10. (Optional) Apply schema changes to database using migrations

11. (Optional) Query database with newly added fields

**Key Files:**
- drizzle.config.ts: Drizzle configuration
- src/schema.ts: Generated/updated database schema
- .env: Environment variables including DATABASE_URL
- index.ts: Application entry point with queries

**Note:** If PostgreSQL database doesn't exist, setup guide available for PostgreSQL in Docker with database URL generation instructions.

### postgresql_new_project_setup
Step-by-step PostgreSQL project initialization: install pg/@types/pg, set DATABASE_URL, connect Drizzle with node-postgres, define tables, configure drizzle.config.ts, apply migrations, seed/query with TypeScript, run index.ts.

## PostgreSQL New Project Setup

Complete walkthrough for initializing a new Drizzle ORM project with PostgreSQL using node-postgres driver.

### Prerequisites
- **dotenv** - environment variable management
- **tsx** - TypeScript file execution
- **node-postgres** - PostgreSQL database querying

### Setup Steps

**Step 1: Install Dependencies**
Install `pg` package and `@types/pg` dev dependency for PostgreSQL support.

**Step 2: Configure Connection Variables**
Set up `DATABASE_URL` environment variable containing your PostgreSQL connection string.

**Step 3: Connect Drizzle to Database**
Initialize Drizzle ORM connection using node-postgres driver with your database URL.

**Step 4: Define Tables**
Create database schema by defining table structures using Drizzle's table definition API.

**Step 5: Setup Drizzle Config**
Create `drizzle.config.ts` configuration file specifying PostgreSQL dialect and DATABASE_URL environment variable.

**Step 6: Apply Database Changes**
Run migrations to apply schema changes to your PostgreSQL database.

**Step 7: Seed and Query Database**
Write and execute TypeScript code to insert seed data and query the database using Drizzle ORM.

**Step 8: Execute Application**
Run the `index.ts` file to test your setup.

### Additional Resources
- Drizzle supports both `node-postgres` and `postgres.js` drivers for PostgreSQL
- For local PostgreSQL setup, use Docker with the provided PostgreSQL local setup guide
- Alternative PostgreSQL connection methods available in dedicated connection documentation

### singlestore-existing-project
11-step integration guide for Drizzle ORM with SingleStore in existing projects: install mysql2, configure DATABASE_URL and drizzle.config.ts, introspect database, connect client, query, with optional schema updates and migrations.

## Setup Drizzle ORM with SingleStore in an Existing Project

This guide walks through integrating Drizzle ORM into an existing project that uses SingleStore database.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - MySQL driver for querying SingleStore database

### Setup Steps

1. **Install mysql2 package** - Required driver for SingleStore connections

2. **Setup connection variables** - Configure `DATABASE_URL` environment variable with your SingleStore connection string

3. **Setup Drizzle config file** - Create drizzle.config.ts with dialect set to 'singlestore' and reference the DATABASE_URL environment variable

4. **Introspect your database** - Run introspection to automatically generate schema definitions from existing SingleStore database tables

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Initialize Drizzle client with mysql2 connection and pass your schema

7. **Query the database** - Write and execute queries using Drizzle ORM against SingleStore

8. **Run index.ts file** - Execute your TypeScript file with tsx to test the setup

9. **Update table schema (optional)** - Modify schema definitions as needed

10. **Apply changes to database (optional)** - Use migrations to apply schema changes to SingleStore

11. **Query with new fields (optional)** - Test queries with updated schema fields

### singlestore_setup
Step-by-step setup for Drizzle ORM with SingleStore: install mysql2, configure DATABASE_URL, connect via drizzle-orm/singlestore, define schema, setup drizzle.config.ts with singlestore dialect, apply migrations, seed/query, run TypeScript.

## Getting Started with Drizzle ORM and SingleStore

This guide walks through setting up Drizzle ORM with a SingleStore database using the `mysql2` driver.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **mysql2** - MySQL client for Node.js with performance focus

### Setup Steps

**Step 1: Install mysql2 package**
Install the mysql2 package which Drizzle ORM natively supports via the `drizzle-orm/singlestore` package.

**Step 2: Setup connection variables**
Configure DATABASE_URL environment variable for database connection.

**Step 3: Connect Drizzle ORM to the database**
Initialize Drizzle ORM connection using the SingleStore driver with mysql2.

**Step 4: Create a table**
Define your database schema using Drizzle ORM's table definition API for SingleStore.

**Step 5: Setup Drizzle config file**
Create drizzle.config.ts with dialect set to 'singlestore' and DATABASE_URL environment variable reference.

**Step 6: Applying changes to the database**
Run migrations to apply schema changes to your SingleStore database.

**Step 7: Seed and Query the database**
Insert seed data and execute queries against the SingleStore database using Drizzle ORM.

**Step 8: Run index.ts file**
Execute your TypeScript application file to test the setup.

### Key Points
- Drizzle ORM natively supports mysql2 driver for SingleStore databases
- The `drizzle-orm/singlestore` package provides SingleStore-specific functionality
- Configuration uses standard environment variables and config file pattern

### sqlite_cloud_existing_project_setup
Setup Drizzle with SQLite Cloud in existing project: install packages, set connection string env var, configure drizzle.config.ts, introspect database, then use drizzle() to insert/select/update/delete records.

## Setup Drizzle ORM with SQLite Cloud in an existing project

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- SQLite Cloud database and driver (sqlitecloud-js)

### Installation
Install packages: `drizzle-orm@beta @sqlitecloud/drivers dotenv` and dev dependencies `drizzle-kit@beta tsx`

### Configuration Steps

1. **Environment Variables**: Set `SQLITE_CLOUD_CONNECTION_STRING` in `.env` file with your SQLite Cloud connection string

2. **Drizzle Config**: Create `drizzle.config.ts` with dialect set to 'sqlite' and reference the connection string environment variable

3. **Database Introspection**: Run introspection to generate initial schema from existing SQLite Cloud database

4. **Schema File**: Transfer introspected code to `src/db/schema.ts`

5. **Database Connection**: Connect to SQLite Cloud using `drizzle()` from 'drizzle-orm/sqlite-cloud'

### Database Operations Example
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/sqlite-cloud';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  await db.insert(usersTable).values({
    name: 'John',
    age: 30,
    email: 'john@example.com',
  });

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
}

main();
```

### Schema Updates (Optional)
After updating table schema in `src/db/schema.ts`, apply changes to database and query with new fields. Example shows adding optional `phone` field to users table and querying it.

### sqlite_cloud_setup
Step-by-step setup for SQLite Cloud with Drizzle ORM: install packages, configure connection string, define schema, run migrations, execute CRUD operations with insert/select/update/delete examples.

## Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- SQLite Cloud database account
- SQLite Cloud JavaScript driver

## Installation
Install drizzle-orm@beta, @sqlitecloud/drivers, dotenv, and dev dependencies drizzle-kit@beta and tsx.

## Environment Setup
Set SQLITE_CLOUD_CONNECTION_STRING environment variable with your SQLite Cloud connection details.

## Database Connection
Initialize Drizzle ORM connection to SQLite Cloud using the driver:
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle();
```

## Schema Definition
Define tables using Drizzle schema (example: users table with id, name, age, email fields).

## Configuration
Create drizzle.config.ts with dialect set to 'sqlite' and SQLITE_CLOUD_CONNECTION_STRING environment variable reference.

## Database Operations
Execute CRUD operations:
- Insert: `db.insert(usersTable).values(user)`
- Select: `db.select().from(usersTable)`
- Update: `db.update(usersTable).set({age: 31}).where(eq(usersTable.email, user.email))`
- Delete: `db.delete(usersTable).where(eq(usersTable.email, user.email))`

## Migration
Run drizzle-kit to apply schema changes to the database.

## Execution
Run the TypeScript file using tsx to execute database operations.

### sqlite-existing-project
Integrate Drizzle ORM into existing SQLite project: install @libsql/client, set DB_FILE_NAME env var with file: prefix, configure Drizzle dialect, introspect database, transfer schema, connect via LibSQL, query with ORM.

## Setup Drizzle ORM with SQLite in an Existing Project

This guide walks through integrating Drizzle ORM into an existing SQLite database project using LibSQL client.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **libsql** - SQLite fork optimized for low query latency

### Installation & Configuration

**Step 1: Install packages**
Install `@libsql/client` package.

**Step 2: Setup connection variables**
Create environment variable `DB_FILE_NAME` with LibSQL format. For local SQLite files, prefix with `file:`:
```
DB_FILE_NAME=file:local.db
```

**Step 3: Setup Drizzle config file**
Configure Drizzle with SQLite dialect and reference the `DB_FILE_NAME` environment variable.

### Database Integration

**Step 4: Introspect your database**
Run introspection to analyze existing SQLite database schema.

**Step 5: Transfer code to schema file**
Move introspected schema code to your actual schema file.

**Step 6: Connect Drizzle ORM to database**
Establish connection using LibSQL client with the configured database file.

**Step 7: Query the database**
Execute queries against the database using Drizzle ORM with LibSQL dialect.

**Step 8: Run index.ts file**
Execute the TypeScript file to verify setup.

### Optional: Schema Updates

**Step 9: Update table schema**
Modify table definitions as needed.

**Step 9 (alt): Apply changes to database**
Apply schema changes to the database.

**Step 10: Query with new fields**
Execute queries using updated schema with new fields.

### sqlite_new_project_setup
Step-by-step setup for new SQLite project with libsql driver: install @libsql/client, configure DB_FILE_NAME env var with file: prefix, connect ORM, define schema, setup drizzle.config, apply migrations, seed/query, run with tsx.

## SQLite New Project Setup with Drizzle ORM

**Prerequisites:**
- dotenv - for managing environment variables
- tsx - for running TypeScript files
- libsql - a SQLite fork optimized for low query latency

**Supported Drivers:**
Drizzle has native support for SQLite with `libsql` and `better-sqlite3` drivers. This guide uses `libsql`.

**Step 1: Install Packages**
Install `@libsql/client` package.

**Step 2: Setup Connection Variables**
Set `DB_FILE_NAME` environment variable. For local SQLite database files, use the format `file:local.db` as required by LibSQL.

**Step 3: Connect Drizzle ORM**
Create a connection using the libsql driver with the database file path from environment variables.

**Step 4: Create a Table**
Define your database schema using Drizzle's table definition syntax.

**Step 5: Setup Drizzle Config File**
Create a drizzle.config file with SQLite dialect and reference the `DB_FILE_NAME` environment variable.

**Step 6: Apply Changes to Database**
Run migrations to apply schema changes to the database.

**Step 7: Seed and Query Database**
Write and execute queries using the libsql driver to insert and retrieve data.

**Step 8: Run TypeScript File**
Execute the index.ts file using tsx to test your setup.

### supabase-existing
11-step guide to integrate Drizzle ORM into existing Supabase project: install postgres, configure DATABASE_URL, setup drizzle.config.ts, introspect existing database, connect client, query database, optionally update schema and apply migrations.

## Setup Drizzle ORM with Supabase in an Existing Project

This guide walks through integrating Drizzle ORM into an existing project that uses Supabase (PostgreSQL).

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Supabase** - open source Firebase alternative

### Step-by-Step Setup

**Step 1: Install postgres package**
Install the postgres driver package for database connectivity.

**Step 2: Setup connection variables**
Configure DATABASE_URL environment variable with your Supabase connection string.

**Step 3: Setup Drizzle config file**
Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference.

**Step 4: Introspect your database**
Run introspection to automatically generate schema definitions from your existing Supabase database tables.

**Step 5: Transfer code to schema file**
Move the introspected schema code into your actual schema file (typically src/schema.ts or similar).

**Step 6: Connect Drizzle ORM to the database**
Initialize Drizzle client with postgres connection using DATABASE_URL.

**Step 7: Query the database**
Write and execute queries using Drizzle ORM against your Supabase database.

**Step 8: Run index.ts file**
Execute your TypeScript file using tsx to test the setup.

**Step 9: Update table schema (optional)**
Modify table definitions in your schema file as needed.

**Step 10: Apply changes to database (optional)**
Use Drizzle migrations to push schema changes to Supabase.

**Step 11: Query database with new field (optional)**
Test queries with newly added schema fields.

### tidb_existing_project_setup
Integrate Drizzle ORM with TiDB serverless in existing project: install @tidbcloud/serverless, set DATABASE_URL env var, configure drizzle.config (MySQL dialect), introspect DB, transfer schema, connect with serverless driver, query with tidb-serverless dialect.

## Setup Drizzle ORM with TiDB in an Existing Project

This guide walks through integrating Drizzle ORM with TiDB (PingCAP's Distributed SQL Database) into an existing project.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **TiDB** - the distributed SQL database
- **@tidbcloud/serverless** - for serverless and edge compute platforms requiring HTTP external connections

### Step-by-Step Setup

1. **Install @tidbcloud/serverless package** - Add the TiDB serverless driver to your project

2. **Setup connection variables** - Configure DATABASE_URL environment variable for database connection

3. **Setup Drizzle config file** - Create drizzle.config with MySQL dialect and DATABASE_URL reference

4. **Introspect your database** - Use Drizzle's introspection to analyze existing TiDB database schema

5. **Transfer code to schema file** - Move introspected schema definitions to your actual schema file

6. **Connect Drizzle ORM to database** - Establish connection using @tidbcloud/serverless driver

7. **Query the database** - Execute queries against TiDB using Drizzle ORM with tidb-serverless dialect and DATABASE_URL

8. **Run index.ts file** - Execute your TypeScript application file

9. **Update table schema (optional)** - Modify existing table definitions as needed

10. **Apply changes to database (optional)** - Migrate schema changes to TiDB

11. **Query database with new field (optional)** - Test queries with newly added schema fields

The guide covers both initial setup and optional schema modifications for existing projects.

### tidb_setup_guide
Step-by-step setup for Drizzle ORM with TiDB using @tidbcloud/serverless HTTP driver: install package, configure DATABASE_URL, connect, create schema, setup mysql dialect config, migrate, seed/query, run.

## Getting Started with TiDB

This guide walks through setting up Drizzle ORM with TiDB using HTTP connections via the `@tidbcloud/serverless` driver.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **TiDB** - PingCAP's Distributed SQL Database
- **@tidbcloud/serverless** - driver for HTTP external connections to TiDB

### Important Note
This tutorial uses `@tidbcloud/serverless` driver for HTTP calls. For TCP connections to TiDB, refer to the MySQL Get Started guide instead.

### Setup Steps

1. **Install @tidbcloud/serverless package** - Add the serverless driver dependency
2. **Setup connection variables** - Configure DATABASE_URL environment variable
3. **Connect Drizzle ORM to database** - Initialize Drizzle with TiDB connection
4. **Create a table** - Define schema using Drizzle
5. **Setup Drizzle config file** - Configure with mysql dialect and DATABASE_URL
6. **Apply changes to database** - Run migrations
7. **Seed and Query the database** - Populate and retrieve data using tidb-serverless dialect
8. **Run index.ts file** - Execute the TypeScript application

The guide follows a standard project structure and uses environment variables for database configuration.

### turso_database_existing_project_setup
Step-by-step integration of Drizzle ORM with Turso Database in existing projects: install packages, configure environment and drizzle.config.ts, introspect existing database, connect via drizzle(), perform insert/select/update/delete operations, optionally update schema and run migrations.

## Setup Drizzle ORM with Turso Database in an Existing Project

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Turso Database account and JavaScript driver

### Installation
Install `drizzle-orm@beta`, `@tursodatabase/database`, `dotenv`, and dev dependencies `drizzle-kit@beta`, `tsx`.

### Configuration Steps

1. **Environment Variables**: Set `DB_FILE_NAME` in `.env` file (e.g., `DB_FILE_NAME=mydb.sqlite`)

2. **Drizzle Config**: Create `drizzle.config.ts` with SQLite dialect and reference the `DB_FILE_NAME` environment variable

3. **Database Introspection**: Run introspection to generate schema from existing database

4. **Schema File**: Transfer introspected schema to `src/db/schema.ts`

5. **Database Connection**: Connect using `drizzle()` from `drizzle-orm/tursodatabase/database`

### Database Operations

```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle();

  // Insert
  const user = { name: 'John', age: 30, email: 'john@example.com' };
  await db.insert(usersTable).values(user);

  // Select
  const users = await db.select().from(usersTable);

  // Update
  await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

  // Delete
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
}

main();
```

### Schema Updates
Optionally update table schema by adding new columns (e.g., `phone: varchar('phone')`), then run migrations to apply changes to the database.

### Running Code
Execute the index.ts file using tsx: `tsx src/index.ts`

### getting_started_with_turso_database
Step-by-step setup for Drizzle ORM with Turso Database: install packages, configure environment, connect to database, define schema, apply migrations, and execute CRUD operations.

## Setup and Installation

Install required packages:
```
drizzle-orm@beta @tursodatabase/database dotenv
-D drizzle-kit@beta tsx
```

Set environment variable `DB_FILE_NAME` (e.g., `mydb.sqlite`) for your database file location.

## Database Connection

Connect to Turso Database using drizzle:
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle();
```

## Schema Definition

Create tables using Drizzle schema (see CreateTable component for details).

## Configuration

Setup `drizzle.config.ts` with SQLite dialect and `DB_FILE_NAME` environment variable.

## Database Operations

Apply migrations to the database using Drizzle Kit.

Perform CRUD operations:
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

Run TypeScript files using `tsx` package.

### turso-existing
Integrate Drizzle ORM with Turso Cloud SQLite in existing project: install @libsql/client, configure credentials in .env, create drizzle.config.ts with turso dialect, introspect existing database, initialize connection with drizzle({ connection: { url, authToken } }) or drizzle({ client }), query with db instance.

## Setup Drizzle ORM with Turso Cloud in an existing project

### Prerequisites
- dotenv: environment variable management
- tsx: TypeScript file execution
- turso: SQLite for production
- libsql: SQLite fork optimized for low query latency

### Installation
Install the libsql client package:
```bash
npm install @libsql/client
```

### Environment Configuration
Create `.env` file with Turso credentials:
```plaintext
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Obtain these values from the LibSQL Driver SDK tutorial at docs.turso.tech/sdk/ts/quickstart

### Drizzle Configuration
Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

### Database Introspection
Run introspection to generate schema from existing database (details in IntrospectSqlite component).

### Schema Setup
Transfer introspected code to `src/db/schema.ts`.

### Database Connection
Create `src/index.ts` with connection initialization. Two approaches:

**Option 1 - Direct connection:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

**Option 2 - With existing driver:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});

const db = drizzle({ client });
```

### Querying
Query the database using the initialized `db` instance (details in QueryTurso component).

### Running
Execute the file with tsx (details in RunFile component).

### Optional: Schema Updates
Update table schema in `src/db/schema.ts` and apply changes to database using Drizzle Kit migrations (details in UpdateSchema and ApplyChanges components).

### turso-new
Setup Drizzle with Turso/LibSQL: install @libsql/client, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars, initialize drizzle({ connection: { url, authToken } }) or drizzle({ client }), configure drizzle.config.ts with dialect 'turso'.

## Getting Started with Drizzle ORM and Turso Cloud

This guide walks through setting up Drizzle ORM with Turso (SQLite for Production) and LibSQL, a fork of SQLite optimized for low query latency.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **turso** - SQLite for Production
- **libsql** - fork of SQLite optimized for low query latency

### Installation and Setup

**Step 1: Install packages**
```
npm install @libsql/client
```

**Step 2: Environment variables**
Create `.env` file with:
```
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Get these values from the LibSQL Driver SDK tutorial at docs.turso.tech/sdk/ts/quickstart

**Step 3: Connect to database**
Create `src/index.ts`:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing driver:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client });
```

**Step 4: Create a table** - covered in separate section

**Step 5: Setup Drizzle config**
Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

**Step 6: Apply changes to database** - covered in separate section

**Step 7: Seed and query database** - covered in separate section

**Step 8: Run the file** - covered in separate section

### vercel_postgres_existing_project_setup
Setup Drizzle with Vercel Postgres in existing project: install @vercel/postgres, set POSTGRES_URL env var, configure drizzle.config.ts, introspect database, use drizzle() for insert/select/update/delete operations.

## Setup Drizzle ORM with Vercel Postgres in an existing project

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Vercel Postgres database and driver

### Installation & Configuration
1. Install `@vercel/postgres` package
2. Set `POSTGRES_URL` environment variable from Vercel Postgres storage tab
3. Create drizzle.config.ts with dialect 'postgresql' and POSTGRES_URL reference

### Database Introspection & Schema
4. Introspect existing database to auto-generate schema
5. Transfer introspected code to schema file
6. Connect to database using `drizzle()` from 'drizzle-orm/vercel-postgres'

### Database Operations
Query example with insert, select, update, delete:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

### Schema Updates (Optional)
- Modify table schema to add new fields
- Run migrations to apply changes
- Query with new fields automatically typed

### vercel_postgres_setup
Connect Drizzle ORM to Vercel Postgres: install @vercel/postgres, set POSTGRES_URL env var, use drizzle() from drizzle-orm/vercel-postgres, configure drizzle.config.ts with postgresql dialect, then insert/select/update/delete via db methods.

## Setup Steps

1. Install `@vercel/postgres` package
2. Set `POSTGRES_URL` environment variable from Vercel Postgres storage tab's `.env.local`
3. Connect Drizzle ORM using `drizzle()` from `drizzle-orm/vercel-postgres`
4. Define database schema with tables
5. Create `drizzle.config.ts` with `dialect: 'postgresql'` and `POSTGRES_URL` reference
6. Run migrations with Drizzle CLI
7. Execute database operations

## Database Operations Example

```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

## Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript files
- Vercel Postgres database and driver

### xata-existing
11-step guide to integrate Drizzle ORM with existing Xata PostgreSQL database: install postgres driver, configure DATABASE_URL and drizzle.config.ts, introspect existing schema, connect to database, query, and optionally update schema and apply migrations.

## Setup Drizzle ORM with Xata in an existing project

This guide walks through integrating Drizzle ORM with an existing Xata PostgreSQL database.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Xata Postgres database

**Setup Steps:**

1. **Install postgres package** - Add the postgres driver package to your project

2. **Setup connection variables** - Create a DATABASE_URL environment variable with your Xata connection string (obtainable from Xata documentation)

3. **Setup Drizzle config file** - Create drizzle.config.ts with PostgreSQL dialect and DATABASE_URL reference

4. **Introspect your database** - Run introspection to generate schema files from your existing database structure

5. **Transfer code to schema file** - Move the introspected schema code to your actual schema file

6. **Connect Drizzle ORM to database** - Set up the database connection using the postgres driver and your connection string

7. **Query the database** - Write and execute queries using Drizzle ORM with postgres-js driver

8. **Run index.ts file** - Execute your TypeScript file to test the setup

9. **Update table schema (optional)** - Modify your table definitions as needed

10. **Apply changes to database (optional)** - Run migrations to apply schema changes to your Xata database

11. **Query with new fields (optional)** - Test queries with newly added fields

