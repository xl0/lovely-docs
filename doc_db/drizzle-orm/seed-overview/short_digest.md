## Drizzle Seed

TypeScript library for generating deterministic, reproducible fake data using seedable pRNG. Supports PostgreSQL, SQLite, MySQL (requires drizzle-orm@0.36.4+).

**Basic usage:** `await seed(db, { users })` creates 10 entities by default.

**Options:** `count` (number of entities), `seed` (seed number for reproducibility)

**Reset database:** `await reset(db, schema)` - uses TRUNCATE CASCADE (PostgreSQL), TRUNCATE with FOREIGN_KEY_CHECKS (MySQL), or DELETE FROM with pragma (SQLite)

**Refinements via `.refine()` callback:**
- `columns`: Custom generator functions per column
- `count`: Override entity count per table
- `with`: Define related entities (e.g., 10 posts per user)

**Weighted random for columns:**
```ts
unitPrice: f.weightedRandom([
  { weight: 0.3, value: f.int({ minValue: 10, maxValue: 100 }) },
  { weight: 0.7, value: f.number({ minValue: 100, maxValue: 300 }) }
])
```

**Weighted random for related entities:**
```ts
details: [
  { weight: 0.6, count: [1, 2, 3] },
  { weight: 0.3, count: [5, 6, 7] },
  { weight: 0.1, count: [8, 9, 10] }
]
```

**Limitations:** `with` only works for one-to-many relationships; TypeScript cannot infer circular table references.