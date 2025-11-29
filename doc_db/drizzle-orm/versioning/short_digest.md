# Versioning

`drizzle-seed` uses versioning to maintain deterministic outputs while allowing generator improvements. Specify with `await seed(db, schema, { version: '2' })`.

Each generator has its own version. When you specify a version, you get the latest version of each generator up to that number.

## Version 2 Changes

**Unique `interval` generator**: Fixed to prevent duplicate intervals after PostgreSQL normalization (e.g., `1 minute 60 seconds` → `2 minutes 0 seconds`).

**`string` generators**: Now generate unique strings respecting column length limits (e.g., `varchar(20)`).

Affected if using `interval({ isUnique: true })` or text columns with length constraints.