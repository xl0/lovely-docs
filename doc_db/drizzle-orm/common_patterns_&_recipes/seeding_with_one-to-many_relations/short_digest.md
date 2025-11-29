## Seeding with `with` Option

Use `with` to generate related data in one-to-many relationships. Requires either a foreign key reference or explicit relation definition.

**Basic example** - Generate 2 users with 3 posts each:
```ts
await seed(db, { users, posts }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,
        },
    },
}));
```

**Schema with foreign key:**
```ts
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    authorId: integer('author_id').notNull().references(() => users.id),
});
```

**Or use explicit relations:**
```ts
export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));

await seed(db, { users, posts, postsRelations }).refine(() => ({...}));
```

**Common errors:**
- Missing foreign key/relation: Add `.references()` or define relations
- Wrong direction (many-to-one): Reverse the relationship
- Self-referencing table: Cannot use `with` on self-references