## Generated Columns

Generated columns are database columns whose values are automatically computed based on expressions involving other columns in the same table. They help ensure data consistency, simplify database design, and improve query performance.

### Types

**Virtual (non-persistent)**: Computed dynamically on each query, no storage space used.

**Stored (persistent)**: Computed during insert/update and stored in the database, can be indexed.

### Use Cases

- Deriving new data from existing columns
- Automating calculations to avoid manual updates
- Enforcing data integrity and consistency
- Simplifying application logic by keeping complex calculations in the database schema

### PostgreSQL

**Types**: STORED only

**Capabilities**:
- Precomputes complex expressions
- Supports indexing on generated columns

**Limitations**:
- Cannot specify default values
- Expressions cannot reference other generated columns or include subqueries
- Schema changes required to modify expressions
- Cannot use in primary keys, foreign keys, or unique constraints

**Drizzle API**: Use `.generatedAlwaysAs()` on any column type. Accepts expressions in three ways:

1. **String**: `text("gen_name").generatedAlwaysAs(\`hello world!\`)`
2. **SQL tag**: `text("gen_name").generatedAlwaysAs(sql\`hello "world"!\`)` - for escaping values
3. **Callback**: `text("gen_name").generatedAlwaysAs((): SQL => sql\`hi, ${test.name}!\`)` - for column references

**Example with full-text search**:
```typescript
const tsVector = customType<{ data: string }>({
  dataType() { return "tsvector"; }
});

export const test = pgTable("test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content"),
  contentSearch: tsVector("content_search", { dimensions: 3 })
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${test.content})`),
}, (t) => [index("idx_content_search").using("gin", t.contentSearch)]);
```

### MySQL

**Types**: STORED, VIRTUAL

**Capabilities**:
- Used in SELECT, INSERT, UPDATE, DELETE statements
- Both virtual and stored columns can be indexed
- Can specify NOT NULL and other constraints

**Limitations**:
- Cannot directly insert or update values in generated columns

**Drizzle API**: Same three expression formats as PostgreSQL. For MySQL, specify mode:

```typescript
export const users = mysqlTable("users", {
  name: text("first_name"),
  storedGenerated: text("stored_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "stored" }
  ),
  virtualGenerated: text("virtual_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

**Drizzle Kit limitations for `push` command**:
- Cannot change generated constraint expression and type - must drop column, push, then add with new expression
- `generate` command has no limitations

### SQLite

**Types**: STORED, VIRTUAL

**Capabilities**:
- Used in SELECT, INSERT, UPDATE, DELETE statements
- Both virtual and stored columns can be indexed
- Can specify NOT NULL and other constraints

**Limitations**:
- Cannot directly insert or update values in generated columns

**Drizzle API**: Same three expression formats. Specify mode like MySQL:

```typescript
export const users = sqliteTable("users", {
  id: int("id"),
  name: text("name"),
  storedGenerated: text("stored_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "stored" }
  ),
  virtualGenerated: text("virtual_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

**Drizzle Kit limitations for `push` and `generate` commands**:
- Cannot change stored generated expression in existing table - must delete and recreate table
- Cannot add stored generated expression to existing column - can only add virtual
- Cannot change stored generated expression - can only change virtual
- Cannot change from virtual to stored - can only change from stored to virtual

### Requirements

Requires `drizzle-orm@0.32.0` or higher and `drizzle-kit@0.23.0` or higher