## Defining Custom Types

Custom types in Drizzle ORM are created using the `customType` function, which allows you to define database-specific data types with TypeScript type safety.

### Core Concept

The `customType` function accepts a generic type parameter `CustomTypeValues` with the following properties:
- `data`: The TypeScript type for the column (e.g., `string`, `number`, `boolean`, `Date`)
- `driverData` (optional): The type the database driver uses internally
- `config` (optional): Configuration object type for parameterized data types
- `notNull` (optional): Set to `true` if the type should be `notNull` by default
- `default` (optional): Set to `true` if the type has a default value by default

### CustomTypeParams Interface

The configuration object passed to `customType` implements `CustomTypeParams<T>`:

- `dataType(config?)`: Required function returning the SQL data type string. Can accept config for parameterized types like `varchar(256)` or `numeric(2,3)`.
- `toDriver(value)`: Optional function mapping TypeScript value to driver format (e.g., object to JSON string).
- `fromDriver(value)`: Optional function mapping driver value back to TypeScript type (e.g., string to Date).

### PostgreSQL Examples

**Serial** - Auto-incrementing integer:
```typescript
const customSerial = customType<{ data: number; notNull: true; default: true }>({
  dataType() { return 'serial'; }
});
```

**Text** - String type:
```typescript
const customText = customType<{ data: string }>({
  dataType() { return 'text'; }
});
```

**Boolean**:
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; }
});
```

**JSONB** - JSON with type-generic support:
```typescript
const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'jsonb'; },
    toDriver(value: TData): string { return JSON.stringify(value); }
  })(name);
```

**Timestamp** - With timezone and precision config:
```typescript
const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision = typeof config.precision !== 'undefined' ? ` (${config.precision})` : '';
    return `timestamp${precision}${config.withTimezone ? ' with time zone' : ''}`;
  },
  fromDriver(value: string): Date { return new Date(value); }
});
```

### MySQL Examples

**Int** - Integer type:
```typescript
const customInt = customType<{ data: number; notNull: false; default: false }>({
  dataType() { return 'int'; }
});
```

**Boolean** - With driver mapping (MySQL returns 0/1):
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
  fromDriver(value) { return typeof value === 'boolean' ? value : value === 1; }
});
```

**JSON** - Type-generic JSON:
```typescript
const customJson = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'json'; },
    toDriver(value: TData): string { return JSON.stringify(value); }
  })(name);
```

**Timestamp** - With fractional seconds precision (fsp):
```typescript
const customTimestamp = customType<{ data: Date; driverData: string; config: { fsp: number } }>({
  dataType(config) {
    const precision = typeof config.fsp !== 'undefined' ? ` (${config.fsp})` : '';
    return `timestamp${precision}`;
  },
  fromDriver(value: string): Date { return new Date(value); }
});
```

### Usage in Table Definitions

Custom types are used like built-in types:

```typescript
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJsonb<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`)
});
```

```typescript
const usersTable = mysqlTable('userstest', {
  id: customInt('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJson<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { fsp: 2 }).notNull().default(sql`now()`)
});
```