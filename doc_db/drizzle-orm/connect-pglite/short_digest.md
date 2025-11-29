## PGlite Integration

WASM-based Postgres for browser/Node.js/Bun, 2.6mb gzipped, supports in-memory or persistent storage.

**Installation:** `npm install drizzle-orm @electric-sql/pglite`

**Usage:**
- In-memory: `drizzle()`
- With persistence: `drizzle('path-to-dir')`
- Advanced config: `drizzle({ connection: { dataDir: 'path-to-dir' }})`
- Existing client: `drizzle({ client: new PGlite() })`