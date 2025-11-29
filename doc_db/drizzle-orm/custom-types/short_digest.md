## Custom Types

Create database-specific types using `customType` with TypeScript type safety.

**CustomTypeValues generic parameters:**
- `data`: TypeScript type (string, number, boolean, Date, etc.)
- `driverData`: Optional driver format type
- `config`: Optional configuration object type
- `notNull`/`default`: Optional boolean flags

**CustomTypeParams configuration:**
- `dataType(config?)`: Returns SQL type string, can use config for parameterized types
- `toDriver(value)`: Optional mapping to driver format
- `fromDriver(value)`: Optional mapping from driver format

**PostgreSQL examples:**
```typescript
const customSerial = customType<{ data: number; notNull: true; default: true }>({
  dataType() { return 'serial'; }
});

const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'jsonb'; },
    toDriver(value: TData): string { return JSON.stringify(value); }
  })(name);

const customTimestamp = customType<{
  data: Date; driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision = typeof config.precision !== 'undefined' ? ` (${config.precision})` : '';
    return `timestamp${precision}${config.withTimezone ? ' with time zone' : ''}`;
  },
  fromDriver(value: string): Date { return new Date(value); }
});
```

**MySQL examples:**
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
  fromDriver(value) { return typeof value === 'boolean' ? value : value === 1; }
});

const customJson = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'json'; },
    toDriver(value: TData): string { return JSON.stringify(value); }
  })(name);
```

**Usage:**
```typescript
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  jsonb: customJsonb<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { withTimezone: true }).notNull()
});
```