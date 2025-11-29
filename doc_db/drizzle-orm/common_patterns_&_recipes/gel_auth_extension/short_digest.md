## Gel auth extension setup

1. Define auth schema in `dbschema/default.esdl` with `using extension auth;` and User type with required identity field
2. Create and apply Gel migrations: `gel migration create && gel migration apply`
3. Configure `drizzle.config.ts` with `dialect: 'gel'` and `schemaFilter: ['ext::auth', 'public']`
4. Run `drizzle-kit pull` to generate TypeScript schema with Identity and User tables from ext::auth

Generated schema includes Identity table with id, createdAt, issuer, modifiedAt, subject fields and User table with id, email, identityId, username fields with foreign key to Identity.