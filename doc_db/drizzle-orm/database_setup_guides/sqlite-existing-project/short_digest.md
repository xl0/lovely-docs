## Setup Drizzle ORM with SQLite in Existing Project

**Prerequisites:** dotenv, tsx, libsql

**Configuration:**
1. Install `@libsql/client`
2. Set `DB_FILE_NAME=file:local.db` environment variable
3. Configure Drizzle with SQLite dialect

**Integration:**
4. Introspect existing database
5. Transfer introspected schema to schema file
6. Connect using LibSQL client
7. Query database with Drizzle ORM
8. Run TypeScript file

**Optional:** Update schema and apply changes to database