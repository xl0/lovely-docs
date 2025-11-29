Generate Valibot schemas from Drizzle ORM tables for validation.

**Functions**: `createSelectSchema()` (all fields required), `createInsertSchema()` (excludes auto-generated), `createUpdateSchema()` (all optional, no auto-generated).

**Refinements**: Pass optional parameter with field overrides - callback functions extend/modify, Valibot schemas overwrite.

**Type Mapping**: Boolean → `boolean()`, Date → `date()`, String → `string()`, UUID → `pipe(string(), uuid())`, Char → `pipe(string(), length(n))`, Varchar → `pipe(string(), maxLength(n))`, Enum → `enum([...])`, Integer types with min/max bounds, Float types with bounds, BigInt modes, Geometry (tuple/xy), Vector/Line, JSON, Buffer, Arrays.