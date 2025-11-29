## Numeric Types
- **integer/smallint/bigint**: Signed integers (4/2/8 bytes). Use serial/smallserial/bigserial for auto-increment. Bigint supports `mode: 'number'` for JS numbers.
- **numeric/decimal**: Exact precision decimals with configurable precision/scale. Supports `mode: 'number'` or `'bigint'`.
- **real/double precision**: Floating-point numbers (4/8 bytes).

## String Types
- **text**: Unlimited variable-length. Supports `enum` config for type inference.
- **varchar/char**: Variable/fixed-length strings with optional length limit. Support `enum` config.

## JSON
- **json/jsonb**: JSON data with `.$type<T>()` for compile-time type safety.

## Date/Time
- **time**: Time with optional timezone and precision.
- **timestamp**: Date+time with optional timezone, precision, and `mode: 'date'|'string'`. Use `defaultNow()` for current time.
- **date**: Calendar date with `mode: 'date'|'string'`.
- **interval**: Time span with optional fields and precision.

## Geometric
- **point**: Geometric point with `mode: 'tuple'` (default [x,y]) or `'xy'` ({x,y}).
- **line**: Geometric line with `mode: 'tuple'` (default [a,b,c]) or `'abc'` ({a,b,c}).

## Enum
- **enum**: Static ordered set of values via `pgEnum()`.

## Column Modifiers
- `.$type<T>()`: Custom type for branded/unknown types.
- `.generatedAlwaysAsIdentity()`: Auto-generate unique integers via sequences (requires drizzle-orm@0.32.0+).
- `.default(value)` / `.$defaultFn(fn)`: Default values (runtime defaults don't affect drizzle-kit).
- `.$onUpdateFn(fn)`: Generate values on update.
- `.notNull()`: NOT NULL constraint.
- `.primaryKey()`: Primary key constraint.