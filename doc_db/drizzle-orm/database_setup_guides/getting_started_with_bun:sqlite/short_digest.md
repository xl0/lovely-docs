## Setup with Bun:SQLite

1. Install: `drizzle-orm`, `-D drizzle-kit @types/bun`
2. Set `DATABASE_URL` environment variable
3. Connect to database using ConnectBun
4. Create table schema
5. Configure drizzle config with `dialect='postgresql'`
6. Apply migrations
7. Query database using bun-sql dialect
8. Run with `bun src/index.ts`

**Note**: Bun 1.2.0 has concurrent statement execution issues.