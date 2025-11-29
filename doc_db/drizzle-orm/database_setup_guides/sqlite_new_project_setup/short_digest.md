## SQLite Setup with Drizzle ORM

**Prerequisites:** dotenv, tsx, libsql

**Steps:**
1. Install `@libsql/client`
2. Set `DB_FILE_NAME=file:local.db` environment variable
3. Connect Drizzle ORM using libsql driver
4. Define table schema
5. Create drizzle.config with SQLite dialect
6. Apply migrations
7. Seed and query database
8. Run with tsx