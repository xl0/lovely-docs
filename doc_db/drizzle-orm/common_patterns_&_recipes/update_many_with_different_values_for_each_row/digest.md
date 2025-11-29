Update multiple rows with different values in a single request using SQL CASE statements.

**Approach**: Use the `sql` operator with a CASE statement combined with `.update().set()` and `.where(inArray())` methods.

**Implementation**:
1. Build an array of input objects containing id and the new value for each row
2. Construct SQL chunks starting with `(case`
3. For each input, add a `when id = X then value` clause
4. Close with `end)`
5. Join all chunks and pass to `.set()`
6. Filter with `.where(inArray(ids))`

**Example**:
```ts
const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
  { id: 3, city: 'Chicago' },
];

if (inputs.length === 0) return;

const sqlChunks: SQL[] = [];
const ids: number[] = [];

sqlChunks.push(sql`(case`);
for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}
sqlChunks.push(sql`end)`);

const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
await db.update(users).set({ city: finalSql }).where(inArray(users.id, ids));
```

**Generated SQL**:
```sql
update users set "city" = 
  (case when id = 1 then 'New York' when id = 2 then 'Los Angeles' when id = 3 then 'Chicago' end)
where id in (1, 2, 3)
```

**Supported databases**: PostgreSQL, MySQL, SQLite

**Important**: Ensure the inputs array is not empty before executing the update.