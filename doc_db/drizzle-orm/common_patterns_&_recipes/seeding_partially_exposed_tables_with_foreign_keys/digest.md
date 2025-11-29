## Problem
When seeding a database with Drizzle Seed, if a table has a foreign key column with a not-null constraint, but the referenced table is not exposed to the seed function, an error occurs: "Column 'userId' has not null constraint, and you didn't specify a table for foreign key on column 'userId'".

If the foreign key column is nullable and the referenced table is not exposed, a warning is issued instead, and the column will be filled with null values.

## Solutions

**Option 1: Remove the not-null constraint**
```ts
userId: integer().references(() => users.id)  // nullable
```

**Option 2: Expose the referenced table**
```ts
await seed(db, { bloodPressure, users });
```

**Option 3: Refine the column generator**
Manually specify values for the foreign key column using `valuesFromArray()`. This requires the referenced table to already have data in the database:
```ts
await seed(db, { bloodPressure }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      userId: funcs.valuesFromArray({ values: [1, 2] })
    }
  }
}));
```

## Scenarios

**Scenario 1 (Error):** Foreign key column is not-null and referenced table is not exposed
- Error is thrown
- Must use one of the three solutions above

**Scenario 2 (Warning):** Foreign key column is nullable and referenced table is not exposed
- Warning is issued
- Column will be filled with null values
- Can ignore warning or use refinement to provide specific values