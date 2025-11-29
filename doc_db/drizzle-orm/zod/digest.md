## Overview
`drizzle-zod` is a plugin that generates Zod schemas from Drizzle ORM schemas, enabling validation of database queries and API requests/responses.

**Requirements:** drizzle-zod@0.6.0+, Drizzle ORM v0.36.0+, Zod v3.25.1+

## Select Schema
Validates data queried from the database. Generated from table definitions and can validate API responses.

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema.parse(rows[0]); // Validates all fields match schema
```

Supports views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data before insertion into the database. Can validate API requests.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema.parse(user); // Validates required fields
await db.insert(users).values(parsed);
```

## Update Schema
Validates data for database updates. All fields become optional since updates are partial.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema.parse(user); // Generated columns like `id` cannot be updated
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Extend, modify, or overwrite field schemas using optional parameters. Callback functions extend/modify; Zod schemas overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20), // Extends schema
  bio: (schema) => schema.max(1000), // Extends before nullability applied
  preferences: z.object({ theme: z.string() }) // Overwrites field including nullability
});
```

## Factory Functions
Use `createSchemaFactory` for advanced use cases.

**Extended Zod instance:**
```ts
import { z } from '@hono/zod-openapi';
const { createInsertSchema } = createSchemaFactory({ zodInstance: z });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.openapi({ example: 'John' })
});
```

**Type coercion:**
```ts
const { createInsertSchema } = createSchemaFactory({
  coerce: { date: true } // Coerce dates; set `coerce: true` for all types
});
const userInsertSchema = createInsertSchema(users);
// Generates z.coerce.date() for timestamp fields
```

## Data Type Reference
Maps Drizzle ORM column types to Zod schemas across PostgreSQL, MySQL, and SQLite:

- **Boolean:** `z.boolean()`
- **Date/Timestamp:** `z.date()`
- **String types (text, varchar, etc.):** `z.string()` with optional `.max(length)` or `.length(length)`
- **UUID:** `z.string().uuid()`
- **Bit:** `z.string().regex(/^[01]+$/).max(dimensions)`
- **Enum:** `z.enum(enum)`
- **Integer types:** `z.number().min(min).max(max).int()` with appropriate bit limits (8-bit, 16-bit, 32-bit, 48-bit, 64-bit)
- **BigInt:** `z.bigint().min(min).max(max)` for 64-bit values
- **Float/Double:** `z.number()` with appropriate bit limits
- **Year:** `z.number().min(1901).max(2155).int()`
- **Geometry (point):** `z.tuple([z.number(), z.number()])` or `z.object({ x: z.number(), y: z.number() })`
- **Vector/Halfvec:** `z.array(z.number()).length(dimensions)`
- **Line:** `z.object({ a: z.number(), b: z.number(), c: z.number() })` or tuple variant
- **JSON/JSONB:** `z.union([z.union([z.string(), z.number(), z.boolean(), z.null()]), z.record(z.any()), z.array(z.any())])`
- **Buffer:** `z.custom<Buffer>((v) => v instanceof Buffer)`
- **Arrays:** `z.array(baseDataTypeSchema).length(size)`

MySQL-specific limits: tinytext (255), text (65,535), mediumtext (16,777,215), longtext (4,294,967,295)