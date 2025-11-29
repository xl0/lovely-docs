Update multiple rows with different values in one request using SQL CASE statements with `sql` operator, `.update().set()`, and `.where(inArray())`.

**Example**:
```ts
const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
];

const sqlChunks: SQL[] = [sql`(case`];
const ids: number[] = [];

for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}
sqlChunks.push(sql`end)`);

await db.update(users).set({ city: sql.join(sqlChunks, sql.raw(' ')) }).where(inArray(users.id, ids));
```

Generates: `update users set "city" = (case when id = 1 then 'New York' when id = 2 then 'Los Angeles' end) where id in (1, 2)`