## Migration Strategies

SQL databases require schema migrations when structure changes. Drizzle supports database-first and codebase-first approaches via drizzle-kit CLI.

**Six Options:**
1. **Pull schema** from database → TypeScript: `drizzle-kit pull`
2. **Push schema** directly to database: `drizzle-kit push` (rapid prototyping)
3. **Generate SQL files** + CLI migrate: `drizzle-kit generate` → `drizzle-kit migrate`
4. **Generate SQL files** + runtime migrate: `drizzle-kit generate` → `await migrate(db)` (zero-downtime deployments)
5. **Generate SQL files** + external tools: `drizzle-kit generate` → Liquibase/Bytebase/Atlas
6. **Export SQL** + Atlas: `drizzle-kit export` → Atlas

Each approach fits different workflows: solo development, team collaboration, production deployments, serverless environments.