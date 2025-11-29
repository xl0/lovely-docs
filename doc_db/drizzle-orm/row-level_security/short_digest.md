## Row-Level Security (RLS)

Enable RLS on tables with `.enableRLS()` or by adding policies. Define roles with `pgRole()` and policies with `pgPolicy()` as table parameters.

**Basic setup:**
```ts
export const admin = pgRole('admin', { createRole: true });
export const users = pgTable('users', { id: integer() }, (t) => [
	pgPolicy('policy', {
		as: 'permissive',
		to: admin,
		for: 'delete',
		using: sql``,
		withCheck: sql``,
	}),
]);
```

**Policy options:** `as` (permissive/restrictive), `to` (role), `for` (all/select/insert/update/delete), `using`, `withCheck`

**Link to existing table:** `.link(existingTable)`

**Enable role management in drizzle.config.ts:**
```ts
entities: { roles: true }
```

**Exclude/include roles:**
```ts
entities: { roles: { exclude: ['admin'] } }
entities: { roles: { include: ['admin'] } }
```

**Provider-specific exclusions:**
```ts
entities: { roles: { provider: 'neon' } }  // or 'supabase'
```

**RLS on views:** Use `.with({ securityInvoker: true })`

**Neon:** Use `crudPolicy()` from `'drizzle-orm/neon'` with predefined `authenticatedRole`, `anonymousRole`, `authUid()`, and `neonIdentitySchema`

**Supabase:** Use predefined roles (`anonRole`, `authenticatedRole`, `serviceRole`, etc.) and tables (`authUsers`, `realtimeMessages`) from `'drizzle-orm/supabase'`. Use `createDrizzle()` wrapper to handle RLS transactions with JWT tokens.