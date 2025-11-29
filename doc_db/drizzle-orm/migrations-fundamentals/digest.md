## Database Migrations Fundamentals

SQL databases require strict schemas defined upfront. When schema changes are needed, they must be applied via migrations. Drizzle supports both database-first and codebase-first approaches.

**Database First vs Codebase First:**
- **Database First**: Database schema is source of truth. Manage schema directly on database or via migration tools, then pull schema to codebase.
- **Codebase First**: TypeScript/JavaScript schema in codebase is source of truth under version control. Declare schema in code, apply to database.

**Drizzle-kit** is a CLI tool that supports both approaches with commands: `drizzle-kit migrate`, `drizzle-kit generate`, `drizzle-kit push`, `drizzle-kit pull`.

**Six Migration Strategies:**

1. **Database First - Pull Schema**: Use `drizzle-kit pull` to pull database schema and generate TypeScript Drizzle schema file. Example: Pull existing database with users table → generates TypeScript schema with pgTable definition.

2. **Codebase First - Direct Push**: Use `drizzle-kit push` to push TypeScript schema directly to database without SQL files. Best for rapid prototyping. Example: Add `email: p.text().unique()` to schema → drizzle-kit push detects diff and applies `ALTER TABLE users ADD COLUMN email TEXT UNIQUE`.

3. **Codebase First - Generate & CLI Migrate**: Use `drizzle-kit generate` to create SQL migration files, then `drizzle-kit migrate` to apply them. Example: Generate creates `drizzle/20242409125510_premium_mister_fear/migration.sql` with CREATE TABLE statement → migrate command reads migration history from database and applies unapplied migrations.

4. **Codebase First - Generate & Runtime Migrate**: Use `drizzle-kit generate` to create SQL files, then apply during application runtime via `migrate(db)`. Used for monolithic apps with zero-downtime deployments and serverless deployments. Example: Call `await migrate(db)` in application startup code to apply pending migrations.

5. **Codebase First - Generate & External Tools**: Use `drizzle-kit generate` to create SQL files, then apply via external migration tools (Bytebase, Liquibase, Atlas, etc.) or directly to database. Example: Generate migration file, then run via Liquibase or direct SQL execution.

6. **Codebase First - Export & Atlas**: Use `drizzle-kit export` to output SQL representation of schema to console, then apply via Atlas or other external SQL tools. Example: Export generates CREATE TABLE statement → pipe to Atlas for application.