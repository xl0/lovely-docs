## Overview
`drizzle-zod` generates Zod schemas from Drizzle ORM schemas for validating database queries and API requests/responses.

## Core Functions
- **`createSelectSchema(table)`** - Validates data queried from database
- **`createInsertSchema(table)`** - Validates data before insertion (required fields only)
- **`createUpdateSchema(table)`** - Validates partial updates (all fields optional)
- **`createSchemaFactory(options)`** - Advanced use cases with extended Zod instances or type coercion

## Refinements
Extend or overwrite field schemas:
```ts
createSelectSchema(users, {
  name: (schema) => schema.max(20), // Extends
  preferences: z.object({ theme: z.string() }) // Overwrites
});
```

## Factory Examples
```ts
// Extended Zod instance
const { createInsertSchema } = createSchemaFactory({ zodInstance: z });

// Type coercion
const { createInsertSchema } = createSchemaFactory({ coerce: { date: true } });
```

## Data Type Mappings
Boolean → `z.boolean()`, Date → `z.date()`, String → `z.string()`, UUID → `z.string().uuid()`, Integer → `z.number().min(min).max(max).int()`, BigInt → `z.bigint()`, JSON → `z.union([...])`, Arrays → `z.array(baseType).length(size)`, and more with appropriate bit-limit constraints