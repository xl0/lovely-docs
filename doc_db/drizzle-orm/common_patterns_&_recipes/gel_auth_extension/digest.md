## Setting up Gel auth extension with Drizzle ORM

This guide covers integrating Gel's auth extension with Drizzle ORM for managing user authentication.

### Prerequisites
- Gel database setup (see get-started-gel)
- drizzle-kit pull command available

### Step 1: Define Gel auth schema
Add auth extension to `dbschema/default.esdl`:
```esdl
using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id, username, email }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required identity: ext::auth::Identity;
    required username: str;
    required email: str;
  }
}
```

### Step 2: Push schema to database
Generate and apply Gel migrations:
```bash
gel migration create
gel migration apply
```

### Step 3: Configure Drizzle
Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
  schemaFilter: ['ext::auth', 'public']
});
```

### Step 4: Pull schema to Drizzle
Run `drizzle-kit pull` to generate TypeScript schema file.

Generated schema includes all auth tables. Example output:
```typescript
import { gelTable, uniqueIndex, uuid, text, gelSchema, timestamptz, foreignKey } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const extauth = gelSchema('ext::auth');

export const identityInExtauth = extauth.table('Identity', {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamptz('created_at').default(sql`(clock_timestamp())`).notNull(),
	issuer: text().notNull(),
	modifiedAt: timestamptz('modified_at').notNull(),
	subject: text().notNull(),
}, (table) => [
	uniqueIndex('6bc2dd19-bce4-5810-bb1b-7007afe97a11;schemaconstr').using(
		'btree',
		table.id.asc().nullsLast().op('uuid_ops'),
	),
]);

export const user = gelTable('User', {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: text().notNull(),
	identityId: uuid('identity_id').notNull(),
	username: text().notNull(),
}, (table) => [
	uniqueIndex('d504514c-26a7-11f0-b836-81aa188c0abe;schemaconstr').using(
		'btree',
		table.id.asc().nullsLast().op('uuid_ops'),
	),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identityInExtauth.id],
		name: 'User_fk_identity',
	}),
]);
```

The drizzle-kit pull command generates all auth extension tables, not just Identity. After pulling, auth tables are ready for use in queries.