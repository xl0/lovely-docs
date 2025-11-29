# Versioning

`drizzle-seed` uses versioning to manage outputs for static and dynamic data generators. The same `seed` number produces identical results (deterministic), and when generators change, the version increments, allowing you to choose between old and new behavior.

Specify a version with `await seed(db, schema, { version: '2' })`. If no version is specified, the latest is used.

## Version History

| API Version | NPM Version | Changed Generators |
|---|---|---|
| `v1` | `0.1.1` | - |
| `v2 (LTS)` | `0.2.1` | `string()`, `interval({ isUnique: true })` |

## How Versioning Works

Each generator has its own version. When you specify a version, you get the latest version of each generator up to that version number. For example, if `lastName` generator changed to V2 and `firstName` changed to V3:

- No version specified: `firstName` V3, `lastName` V2
- `version: '2'`: `firstName` V1, `lastName` V2
- `version: '1'`: `firstName` V1, `lastName` V1

## Version 2 Changes

### Unique `interval` Generator

**Problem**: The old generator could produce intervals like `1 minute 60 seconds` and `2 minutes 0 seconds` as distinct values. However, PostgreSQL normalizes `1 minute 60 seconds` to `2 minutes 0 seconds`, causing unique constraint violations when both are inserted.

**Affected if**: Your table has a unique `interval` column or you use `f.interval({ isUnique: true })` in seeding scripts.

Example affected schema:
```ts
const intervals = pgTable("intervals", {
    interval: interval().unique()
});
```

Example affected seeding script:
```ts
await seed(db, { intervals }).refine((f) => ({
    intervals: {
        columns: {
            interval: f.interval({ isUnique: true }),
        }
    }
}));
```

### `string` Generators (Both Unique and Non-Unique)

**Improvement**: New ability to generate unique strings based on the column's maximum length parameter (e.g., `varchar(20)`).

**Affected if**: Your table includes text-like columns with a maximum length parameter or unique text-like columns.

Example affected schema:
```ts
const strings = pgTable("strings", {
    string1: char({ length: 256 }).unique(),
    string2: varchar({ length: 256 }),
    string3: text().unique(),
});
```

Example affected seeding script:
```ts
await seed(db, { strings }).refine((f) => ({
    strings: {
        columns: {
            string1: f.string({ isUnique: true }),
            string2: f.string(),
            string3: f.string({ isUnique: true }),
        }
    }
}));
```