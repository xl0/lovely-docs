## Generated Columns

Automatically computed database columns based on expressions involving other columns. Two types: Virtual (computed on query, no storage) and Stored (computed on write, stored in DB).

**PostgreSQL** (STORED only): Use `.generatedAlwaysAs()` with string, SQL tag, or callback. Cannot use in constraints, cannot reference other generated columns.

**MySQL** (STORED/VIRTUAL): Same API with `{ mode: "stored" | "virtual" }` option. Cannot change expression with `push` command.

**SQLite** (STORED/VIRTUAL): Same API with mode option. Cannot modify stored expressions in existing tables - must recreate table.

**Example**:
```typescript
text("gen_name").generatedAlwaysAs((): SQL => sql`hi, ${table.name}!`)
```

Requires `drizzle-orm@0.32.0+` and `drizzle-kit@0.23.0+`