## Full-Text Search

Use `to_tsvector` and `to_tsquery` with `@@` operator. Create GIN indexes for performance.

**Query patterns:**
- Single keyword: `to_tsquery('english', 'trip')`
- OR keywords: `to_tsquery('english', 'Europe | Asia')`
- AND keywords: `plainto_tsquery('english', 'discover Italy')`
- Phrase: `phraseto_tsquery('english', 'family trip')`
- Web syntax: `websearch_to_tsquery('english', 'family or first trip')`

**Multi-column search** with `setweight`:
```ts
index('search_index').using('gin', sql`(
  setweight(to_tsvector('english', ${table.title}), 'A') ||
  setweight(to_tsvector('english', ${table.description}), 'B')
)`)
```

**Ranking** with `ts_rank` (frequency) or `ts_rank_cd` (proximity), ordered by rank descending.