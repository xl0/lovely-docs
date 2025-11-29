## Breaking Change

postgres.js driver now always returns date strings; Drizzle maps them based on mode. Client objects passed to Drizzle will be mutated with all dates as strings.

## Fixes

Resolved 8 timestamp/date handling issues including mode mismatches, type annotation errors, timezone problems, and millisecond loss during inserts.