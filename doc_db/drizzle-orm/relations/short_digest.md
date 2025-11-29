## One-to-One
```ts
export const usersRelations = relations(users, ({ one }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
}));
```

## One-to-Many
```ts
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

## Many-to-Many
```ts
export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable('users_to_groups', {
  userId: integer('user_id').notNull().references(() => users.id),
  groupId: integer('group_id').notNull().references(() => groups.id),
}, (t) => [primaryKey({ columns: [t.userId, t.groupId] })]);
```

## Foreign Key Actions
```ts
author: integer('author').references(() => users.id, { onDelete: 'cascade' })
```
Actions: `cascade`, `restrict`, `no action`, `set null`, `set default`

## Disambiguating Relations
```ts
author: many(posts, { relationName: 'author' }),
reviewer: many(posts, { relationName: 'reviewer' }),
```

Relations are application-level abstractions independent of database foreign keys.