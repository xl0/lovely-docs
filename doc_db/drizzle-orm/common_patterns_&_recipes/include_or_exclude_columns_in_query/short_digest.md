## Core Methods

**Select all columns:**
```ts
await db.select().from(posts);
```

**Select specific columns:**
```ts
await db.select({ title: posts.title }).from(posts);
```

**Select all + extras:**
```ts
await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);
```

**Exclude columns:**
```ts
const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```

## Relational Queries

**Include specific columns:**
```ts
await db.query.posts.findMany({ columns: { title: true } });
```

**Exclude columns:**
```ts
await db.query.posts.findMany({ columns: { content: false } });
```

**With relations:**
```ts
await db.query.posts.findMany({
  columns: { id: true },
  with: {
    comments: { columns: { userId: false, postId: false } },
    user: true,
  },
});
```

**Conditional selection:**
```ts
await db.select({
  id: posts.id,
  ...(withTitle && { title: posts.title }),
}).from(posts);
```