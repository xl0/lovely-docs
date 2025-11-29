## Key Releases

**v0.28.0**: Lateral joins for relational queries (430% IntelliSense speedup), removed nested relation filtering, mysql2 mode for PlanetScale, insert with empty objects

**v0.29.0**: Query builder single-invocation enforcement (use `.$dynamic()` for dynamic), read replicas, set operators (UNION/INTERSECT/EXCEPT), MySQL/PostgreSQL proxy drivers, custom constraint names

**v0.29.1**: Aggregate helpers (count, avg, sum, max, min), ESLint plugin (enforce-delete-with-where, enforce-update-with-where)

**v0.30.0**: Breaking change - postgres.js client mutation for date strings; fixed 8 timestamp/date bugs

**v0.31.0**: PostgreSQL indexes API redesign (per-column ordering, `.using()`), pg_vector with distance helpers, point/line/geometry types, PostGIS support

**v0.32.0**: PostgreSQL sequences/identity columns, generated columns (all dialects), MySQL `$returningId()`, migration file prefix customization

**Drivers Added**: postgres.js, Expo SQLite, OP-SQLite, Xata, PGlite, Vercel Postgres, TiDB Cloud Serverless

**Live Queries**: Expo SQLite `useLiveQuery` hook for auto-rerunning queries on database changes