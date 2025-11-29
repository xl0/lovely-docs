## Setup Drizzle ORM with Bun SQL for existing PostgreSQL project

**Prerequisites:** dotenv, bun, Bun SQL

**Note:** Bun 1.2.0 has concurrent statement execution issues (tracked in GitHub).

**Installation:**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit @types/bun
```

**Setup steps:**
1. Create `.env` with `DATABASE_URL`
2. Create `drizzle.config.ts` with `dialect: 'postgresql'`
3. Introspect existing PostgreSQL database
4. Transfer generated schema to schema file
5. Connect using Bun SQL bindings
6. Write queries with Bun SQL dialect
7. Run with `bun src/index.ts`
8. (Optional) Update schema and apply migrations