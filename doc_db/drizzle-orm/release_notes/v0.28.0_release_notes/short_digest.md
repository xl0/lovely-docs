## Breaking Changes
- **Removed nested relation filtering**: `table` object in `where` callback no longer includes `with`/`extras` fields for more efficient queries
- **Added `mode` config for mysql2**: Use `mode: "default"` for MySQL, `mode: "planetscale"` for PlanetScale (which doesn't support lateral joins)

## Performance Improvements
- **IntelliSense**: 430% faster for large schemas
- **Relational Queries**: Rewritten to use lateral joins, selective data retrieval, reduced aggregations, and simplified grouping

## New Features
- **Insert with defaults**: `db.insert(table).values({})` or `db.insert(table).values([{}, {}])`