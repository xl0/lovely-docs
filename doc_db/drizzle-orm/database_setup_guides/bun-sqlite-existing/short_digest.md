## Setup Drizzle with Bun SQLite (existing project)

**Prerequisites:** dotenv, tsx, bun, bun:sqlite

**Install:** `npm install drizzle-orm dotenv` and `npm install -D drizzle-kit tsx @types/bun`

**Setup:**
1. Create `.env`: `DB_FILE_NAME=mydb.sqlite`
2. Configure `drizzle.config.ts` with SQLite dialect
3. Introspect existing database to generate schema
4. Connect Drizzle to database
5. Run queries: `bun src/index.ts`

**Optional:** Update schema and apply changes to database