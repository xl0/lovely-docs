## Breaking Changes

The postgres.js driver instance has been modified to always return strings for dates. Drizzle then maps these strings to either strings or Date objects based on the selected mode. This is a breaking change because:

1. The behavior of postgres.js client objects passed to Drizzle will be mutated - all dates will be strings in responses
2. Timestamps with and without timezone now always use `.toISOString()` for mapping to the driver
3. If you were relying on specific timestamp response types, behavior will change

The change was necessary because postgres.js doesn't support per-query mapping interceptors. The following parsers were overridden:

```ts
const transparentParser = (val: any) => val;
for (const type of ['1184', '1082', '1083', '1114']) {
	client.options.parsers[type as any] = transparentParser;
	client.options.serializers[type as any] = transparentParser;
}
```

This aligns all drivers with consistent behavior. The team is reaching out to postgres.js maintainers to explore per-query mapping capabilities to avoid client mutation in the future.

## Fixes

Multiple timestamp and date handling issues were resolved:
- timestamp with mode string returned Date object instead of string
- Dates always returned as dates regardless of mode
- Inconsistencies between TypeScript types and actual runtime values for timestamps
- String type annotations on timestamp columns that actually returned Date objects
- Wrong data types for postgres date columns
- Invalid timestamp conversion with PostgreSQL UTC timezone
- Milliseconds being removed during postgres timestamp inserts
- Invalid dates from relational queries