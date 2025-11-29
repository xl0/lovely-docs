## drizzle-arktype Plugin

Generates Arktype schemas from Drizzle ORM schemas. Requires Drizzle ORM v0.36.0+, Arktype v2.0.0+.

**Select Schema** - Validates queried data:
```ts
const userSelectSchema = createSelectSchema(users);
const parsed = userSelectSchema(rows[0]); // { id: number; name: string; age: number }
```

**Insert Schema** - Validates data to insert (excludes auto-generated columns):
```ts
const userInsertSchema = createInsertSchema(users);
const parsed = userInsertSchema({ name: 'Jane', age: 30 });
```

**Update Schema** - Validates data to update (all fields optional, excludes generated columns):
```ts
const userUpdateSchema = createUpdateSchema(users);
const parsed = userUpdateSchema({ age: 35 }); // { name?: string, age?: number }
```

**Refinements** - Extend/modify or overwrite field schemas:
```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends
  preferences: object({ theme: string() }) // Overwrites
});
```

**Data Type Mappings**: Boolean, Date/Timestamp, String, Bit, UUID, Char, Varchar, MySQL text variants, Enum, Integer types (tinyint, smallint, int, bigint), Float/Double, Year, Point, Vector, Line, JSON, Buffer, Array - each with specific Arktype schema equivalents and range constraints.