## LibSQL Migrations Update

LibSQL migrations now use batch execution instead of transactions. Batch operations execute multiple SQL statements sequentially within an implicit transaction - the backend commits all changes on success or performs a full rollback on any failure with no modifications applied.

## Fixes

- Fixed findFirst query for bun:sqlite (PR #1885)