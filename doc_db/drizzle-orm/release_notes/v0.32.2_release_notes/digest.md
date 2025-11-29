## Bug Fixes and Improvements

**AWS Data API Type Hints**: Fixed type hint bugs in the RQB (Query Builder) for AWS Data API integration.

**MySQL Transactions**: Resolved a bug affecting set transactions in MySQL.

**useLiveQuery Dependencies**: Added forwarding dependencies within `useLiveQuery` hook, addressing issue #2651 where dependencies were not properly propagated.

**SQLite Type Exports**: Expanded SQLite package exports to include additional types such as `AnySQLiteUpdate`, providing better type support for update operations.

This release focuses on stability improvements across multiple database drivers and query building utilities.