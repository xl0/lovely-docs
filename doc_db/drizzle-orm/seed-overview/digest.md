## Drizzle Seed

TypeScript library for generating deterministic, realistic fake data to populate databases. Uses a seedable pseudorandom number generator (pRNG) to ensure consistent and reproducible data across runs.

**Supported databases:** PostgreSQL, SQLite, MySQL (not SingleStore)

**Requirements:** drizzle-orm@0.36.4 or higher

### Key Concepts

**Deterministic Data Generation:** Same seed input always produces identical output, enabling predictable and repeatable datasets.

**Pseudorandom Number Generator (pRNG):** Algorithm producing number sequences that approximate randomness but remain reproducible via seed control.

**Benefits:** Consistency across test runs, easier debugging with reproducible data, team collaboration via shared seeds.

### Installation

```
npm install drizzle-seed
```

### Basic Usage

```ts
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";

const users = pgTable("users", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, { users });
}
```

Creates 10 entities by default.

### Options

**`count`:** Specify number of entities to create (default: 10)
```ts
await seed(db, schema, { count: 1000 });
```

**`seed`:** Define seed number for different value sets
```ts
await seed(db, schema, { seed: 12345 });
```

### Reset Database

```ts
import * as schema from "./schema.ts";
import { reset } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, schema);
}
```

**Reset strategies by dialect:**
- **PostgreSQL:** `TRUNCATE tableName1, tableName2, ... CASCADE;`
- **MySQL:** Disables `FOREIGN_KEY_CHECKS`, runs `TRUNCATE` statements, re-enables checks
- **SQLite:** Disables `foreign_keys` pragma, runs `DELETE FROM` statements, re-enables pragma

### Refinements

Use `.refine()` callback to customize seed generator behavior and define table-specific seeding logic:

```ts
await seed(db, schema).refine((f) => ({
  users: {
    columns: {},
    count: 10,
    with: {
      posts: 10
    }
  },
}));
```

**Refinement properties:**
- `columns`: Override default generator functions for specific columns
- `count`: Number of rows to insert (overrides global count if specified)
- `with`: Define how many referenced entities to create for parent table (supports weighted random distribution)

**Example 1 - Refine column generation:**
```ts
await seed(db, { users: schema.users }).refine((f) => ({
  users: {
    columns: {
      name: f.fullName(),
    },
    count: 20
  }
}));
```

**Example 2 - Create related entities:**
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 20,
    with: {
      posts: 10  // 10 posts per user
    }
  }
}));
```

**Example 3 - Custom value ranges and arrays:**
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 5,
    columns: {
      id: f.int({
        minValue: 10000,
        maxValue: 20000,
        isUnique: true,
      }),
    }
  },
  posts: {
    count: 100,
    columns: {
      description: f.valuesFromArray({
        values: [
          "The sun set behind the mountains...",
          "I can't believe how good this pizza...",
          // ...
        ],
      })
    }
  }
}));
```

### Weighted Random

Use weighted random for multiple datasets with different priorities in columns or `with` property:

**Example 1 - Weighted column values:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    count: 5000,
    columns: {
      unitPrice: f.weightedRandom([
        {
          weight: 0.3,
          value: f.int({ minValue: 10, maxValue: 100 })
        },
        {
          weight: 0.7,
          value: f.number({ minValue: 100, maxValue: 300, precision: 100 })
        }
      ]),
    }
  }
}));
```

**Example 2 - Weighted related entity counts:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    with: {
      details: [
        { weight: 0.6, count: [1, 2, 3] },
        { weight: 0.3, count: [5, 6, 7] },
        { weight: 0.1, count: [8, 9, 10] },
      ]
    }
  }
}));
```

### Limitations

**TypeScript limitations for `with`:** Cannot properly infer references between tables due to TypeScript constraints and circular dependencies. The `with` option displays all tables; manually select the one with one-to-many relationship.

**One-to-many only:** `with` works for one-to-many relationships (e.g., users with posts), not many-to-one (posts with users).

**Third parameter type support:** No type support for third parameter in Drizzle tables; works at runtime but not at type level.