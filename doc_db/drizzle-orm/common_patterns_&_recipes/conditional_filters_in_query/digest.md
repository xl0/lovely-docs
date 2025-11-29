## Using Conditional Filters

Pass conditional filters to `.where()` using ternary operators:

```ts
await db
  .select()
  .from(posts)
  .where(term ? ilike(posts.title, term) : undefined);
```

## Combining Multiple Conditional Filters

Use `and()` or `or()` operators to combine multiple conditional filters:

```ts
await db
  .select()
  .from(posts)
  .where(
    and(
      term ? ilike(posts.title, term) : undefined,
      categories.length > 0 ? inArray(posts.category, categories) : undefined,
      views > 100 ? gt(posts.views, views) : undefined,
    ),
  );
```

## Building Filters Dynamically

Create a `SQL[]` array, push filters to it, and pass to `.where()` with `and()` or `or()`:

```ts
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));

await db
  .select()
  .from(posts)
  .where(and(...filters));
```

## Creating Custom Filter Operators

Custom operators are SQL expressions. Use `sql` template tag and `AnyColumn` type:

```ts
const lenlt = (column: AnyColumn, value: number) => {
  return sql`length(${column}) < ${value}`;
};

await db
  .select()
  .from(posts)
  .where(
    and(
      maxLen ? lenlt(posts.title, maxLen) : undefined,
      views > 100 ? gt(posts.views, views) : undefined,
    ),
  );
```

## Implementation Details

Drizzle filter operators are SQL expressions. The `lt` operator is implemented as:

```js
const lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
```

Supported on PostgreSQL, MySQL, and SQLite.