## Overview
`drizzle-typebox` generates Typebox schemas from Drizzle ORM schemas for validation. Requires Drizzle ORM v0.36.0+, Typebox v0.34.8+.

## Schema Types
- **Select**: For querying data, validates API responses
- **Insert**: For inserting data, excludes generated columns
- **Update**: For updating data, all fields optional, excludes generated columns

```ts
const userSelectSchema = createSelectSchema(users);
const userInsertSchema = createInsertSchema(users);
const userUpdateSchema = createUpdateSchema(users);
```

## Refinements
Extend or overwrite field schemas with callbacks or Typebox schemas:

```ts
createSelectSchema(users, {
  name: (schema) => Type.String({ ...schema, maxLength: 20 }),
  preferences: Type.Object({ theme: Type.String() })
});
```

## Factory Functions
Use `createSchemaFactory({ typeboxInstance: t })` for extended Typebox instances.

## Data Type Mappings
Boolean, Date, String, UUID, Char/Varchar, Enum, Integer (8/16/24/32/64-bit, signed/unsigned), Float/Double, Year, Geometry (point, line), Vectors, JSON, Arrays all map to corresponding Typebox types with appropriate constraints.