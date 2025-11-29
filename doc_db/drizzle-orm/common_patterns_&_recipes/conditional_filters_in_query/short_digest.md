## Conditional Filters

Pass conditional filters with ternary operators:
```ts
.where(term ? ilike(posts.title, term) : undefined)
```

Combine with `and()` or `or()`:
```ts
.where(and(
  term ? ilike(posts.title, term) : undefined,
  categories.length > 0 ? inArray(posts.category, categories) : undefined,
))
```

Build filters dynamically in a `SQL[]` array:
```ts
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
await db.select().from(posts).where(and(...filters));
```

Create custom operators using `sql` template tag:
```ts
const lenlt = (column: AnyColumn, value: number) => {
  return sql`length(${column}) < ${value}`;
};
```