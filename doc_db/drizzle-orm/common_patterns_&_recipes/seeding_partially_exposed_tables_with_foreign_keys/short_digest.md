## Seeding with Unexposed Foreign Keys

When seeding tables with foreign key constraints where the referenced table isn't exposed to the seed function:

**Not-null foreign key:** Error occurs. Solutions:
- Remove not-null constraint: `userId: integer().references(() => users.id)`
- Expose referenced table: `await seed(db, { bloodPressure, users })`
- Refine column generator: `await seed(db, { bloodPressure }).refine((funcs) => ({ bloodPressure: { columns: { userId: funcs.valuesFromArray({ values: [1, 2] }) } } }))`

**Nullable foreign key:** Warning issued, column filled with nulls. Can ignore or use refinement to provide values.