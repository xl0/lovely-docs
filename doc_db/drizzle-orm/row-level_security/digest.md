## Row-Level Security (RLS)

Drizzle supports enabling Row-Level Security for PostgreSQL tables, creating policies with various options, and managing roles. Works with Neon and Supabase.

### Enable RLS

Use `.enableRLS()` on a table to enable RLS without policies. PostgreSQL applies a default-deny policy when no policies exist. Operations like TRUNCATE and REFERENCES are not subject to row security.

```ts
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer(),
}).enableRLS();
```

Note: Adding a policy automatically enables RLS, so explicit enablement is unnecessary when policies are present.

### Roles

Define roles using `pgRole()` with options like `createRole`, `createDb`, and `inherit`:

```ts
import { pgRole } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin', { createRole: true, createDb: true, inherit: true });
```

Mark existing database roles with `.existing()` to prevent drizzle-kit from managing them:

```ts
export const admin = pgRole('admin').existing();
```

### Policies

Define policies as parameters to `pgTable`. Policies are always associated with a specific table.

**Full example with all properties:**

```ts
import { sql } from 'drizzle-orm';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy('policy', {
		as: 'permissive',
		to: admin,
		for: 'delete',
		using: sql``,
		withCheck: sql``,
	}),
]);
```

**Policy options:**
- `as`: `'permissive'` or `'restrictive'`
- `to`: Role target - `'public'`, `'current_role'`, `'current_user'`, `'session_user'`, role name string, or `pgRole` object
- `for`: Command type - `'all'`, `'select'`, `'insert'`, `'update'`, `'delete'`
- `using`: SQL for the USING clause
- `withCheck`: SQL for the WITH CHECK clause

**Link policy to existing table:**

Use `.link()` to attach a policy to an existing table (common with Neon/Supabase):

```ts
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, realtimeMessages } from "drizzle-orm/supabase";

export const policy = pgPolicy("authenticated role insert policy", {
  for: "insert",
  to: authenticatedRole,
  using: sql``,
}).link(realtimeMessages);
```

### Migrations

By default, drizzle-kit does not manage roles. Enable role management in `drizzle.config.ts`:

```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: "./drizzle/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL! },
  entities: {
    roles: true
  }
});
```

**Exclude specific roles:**

```ts
entities: {
  roles: {
    exclude: ['admin']
  }
}
```

**Include specific roles:**

```ts
entities: {
  roles: {
    include: ['admin']
  }
}
```

**Use provider to exclude provider-defined roles:**

```ts
entities: {
  roles: {
    provider: 'neon'  // or 'supabase'
  }
}
```

**Combine provider with exclude:**

```ts
entities: {
  roles: {
    provider: 'supabase',
    exclude: ['new_supabase_role']
  }
}
```

### RLS on Views

Enable RLS on views using `securityInvoker` in the view's WITH options:

```ts
export const roomsUsersProfiles = pgView("rooms_users_profiles")
  .with({
    securityInvoker: true,
  })
  .as((qb) =>
    qb
      .select({
        ...getTableColumns(roomsUsers),
        email: profiles.email,
      })
      .from(roomsUsers)
      .innerJoin(profiles, eq(roomsUsers.userId, profiles.id))
  );
```

### Using with Neon

Import `crudPolicy` from `'drizzle-orm/neon'` for a wrapper with predefined functions and Neon's default roles:

```ts
import { crudPolicy } from 'drizzle-orm/neon';
import { integer, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	crudPolicy({ role: admin, read: true, modify: false }),
]);
```

This expands to four policies (insert, update, delete, select) with appropriate SQL conditions.

Neon exposes predefined roles and functions:

```ts
// drizzle-orm/neon
export const authenticatedRole = pgRole('authenticated').existing();
export const anonymousRole = pgRole('anonymous').existing();

export const authUid = (userIdColumn: AnyPgColumn) => sql`(select auth.user_id() = ${userIdColumn})`;

export const neonIdentitySchema = pgSchema('neon_identity');

export const usersSync = neonIdentitySchema.table('users_sync', {
  rawJson: jsonb('raw_json').notNull(),
  id: text().primaryKey().notNull(),
  name: text(),
  email: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});
```

Use them in policies:

```ts
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/neon';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: authenticatedRole,
		withCheck: sql`false`,
	}),
]);
```

### Using with Supabase

Import predefined roles from `'drizzle-orm/supabase'`:

```ts
// drizzle-orm/supabase
export const anonRole = pgRole('anon').existing();
export const authenticatedRole = pgRole('authenticated').existing();
export const serviceRole = pgRole('service_role').existing();
export const postgresRole = pgRole('postgres_role').existing();
export const supabaseAuthAdminRole = pgRole('supabase_auth_admin').existing();
```

Use in policies:

```ts
import { sql } from 'drizzle-orm';
import { serviceRole } from 'drizzle-orm/supabase';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: serviceRole,
		withCheck: sql`false`,
	}),
]);
```

Supabase also provides predefined tables and functions:

```ts
// drizzle-orm/supabase

const auth = pgSchema('auth');
export const authUsers = auth.table('users', {
	id: uuid().primaryKey().notNull(),
});

const realtime = pgSchema('realtime');
export const realtimeMessages = realtime.table(
	'messages',
	{
		id: bigserial({ mode: 'bigint' }).primaryKey(),
		topic: text().notNull(),
		extension: text({
			enum: ['presence', 'broadcast', 'postgres_changes'],
		}).notNull(),
	},
);

export const authUid = sql`(select auth.uid())`;
export const realtimeTopic = sql`realtime.topic()`;
```

Use them in foreign keys and policies:

```ts
import { foreignKey, pgPolicy, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "profiles_id_fk",
    }).onDelete("cascade"),
    pgPolicy("authenticated can view all profiles", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ]
);
```

Link policies to existing Supabase tables:

```ts
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, realtimeMessages } from "drizzle-orm/supabase";

export const policy = pgPolicy("authenticated role insert policy", {
  for: "insert",
  to: authenticatedRole,
  using: sql``,
}).link(realtimeMessages);
```

**Example: createDrizzle wrapper for Supabase RLS**

The Drizzle SupaSecureSlack repository demonstrates using RLS with Supabase. It includes a `createDrizzle` wrapper that handles transactional work:

```ts
type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

export function createDrizzle(token: SupabaseToken, { admin, client }: { admin: PgDatabase<any>; client: PgDatabase<any> }) {
  return {
    admin,
    rls: (async (transaction, ...rest) => {
      return await client.transaction(async (tx) => {
        try {
          await tx.execute(sql`
          select set_config('request.jwt.claims', '${sql.raw(
            JSON.stringify(token)
          )}', TRUE);
          select set_config('request.jwt.claim.sub', '${sql.raw(
            token.sub ?? ""
          )}', TRUE);												
          set local role ${sql.raw(token.role ?? "anon")};
          `);
          return await transaction(tx);
        } finally {
          await tx.execute(sql`
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
            `);
        }
      }, ...rest);
    }) as typeof client.transaction,
  };
}
```

Usage:

```ts
export async function createDrizzleSupabaseClient() {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  return createDrizzle(decode(session?.access_token ?? ""), { admin, client });
}

async function getRooms() {
  const db = await createDrizzleSupabaseClient();
  return db.rls((tx) => tx.select().from(rooms));
}
```