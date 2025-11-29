## Including All Columns

Use `.select()` without arguments to select all columns:
```ts
await db.select().from(posts);
// Result: { id, title, content, views }[]
```

## Including Specific Columns

Pass an object to `.select()` with desired columns:
```ts
await db.select({ title: posts.title }).from(posts);
// Result: { title }[]
```

## Including All Columns Plus Extra Columns

Use `getTableColumns()` utility to spread all columns and add computed fields:
```ts
import { getTableColumns, sql } from 'drizzle-orm';

await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);
// Result: { id, title, content, views, titleLength }[]
```

## Excluding Columns

Use `getTableColumns()` with destructuring to exclude specific columns:
```ts
import { getTableColumns } from 'drizzle-orm';

const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
// Result: { id, title, views }[]
```

## With Joins

Combine column selection with joins by destructuring and spreading:
```ts
const { userId, postId, ...rest } = getTableColumns(comments);

await db.select({
  postId: posts.id,
  comment: { ...rest },
  user: users,
}).from(posts)
  .leftJoin(comments, eq(posts.id, comments.postId))
  .leftJoin(users, eq(users.id, posts.userId));
// Result: { postId, comment: { id, content, createdAt } | null, user: { id, name, email } | null }[]
```

## Relational Queries - Include All

Use `.findMany()` without options:
```ts
await db.query.posts.findMany();
// Result: { id, title, content, views }[]
```

## Relational Queries - Include Specific Columns

Use `columns` option with boolean flags:
```ts
await db.query.posts.findMany({
  columns: { title: true },
});
// Result: { title }[]
```

## Relational Queries - Include All Plus Extra

Use `extras` option with computed fields:
```ts
await db.query.posts.findMany({
  extras: {
    titleLength: sql<number>`length(${posts.title})`.as('title_length'),
  },
});
// Result: { id, title, content, views, titleLength }[]
```

## Relational Queries - Exclude Columns

Use `columns` option with `false` values:
```ts
await db.query.posts.findMany({
  columns: { content: false },
});
// Result: { id, title, views }[]
```

## Relational Queries - With Relations

Use `with` option to control columns in related tables:
```ts
await db.query.posts.findMany({
  columns: { id: true },
  with: {
    comments: {
      columns: { userId: false, postId: false },
    },
    user: true,
  },
});
// Result: { id, user: { id, name, email }, comments: { id, content, createdAt }[] }[]
```

## Conditional Selection

Use spread operator with conditional logic:
```ts
const searchPosts = async (withTitle = false) => {
  await db.select({
    id: posts.id,
    ...(withTitle && { title: posts.title }),
  }).from(posts);
};
// Result: { id, title?: string }[]
```

Supported on PostgreSQL, MySQL, and SQLite.