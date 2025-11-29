## Overview
Drizzle relations enable querying relational data with a simple API. They are application-level abstractions that define relationships between tables without affecting the database schema or creating foreign keys implicitly.

Relational queries example:
```ts
const db = drizzle(client, { schema });
const result = db.query.users.findMany({
  with: {
    posts: true,
  },
});
// Returns: [{ id: 10, name: "Dan", posts: [...] }]
```

## One-to-One Relations
Define with `one()` operator. When the foreign key is in the referenced table, the relation is nullable.

Self-referencing example (user invites another user):
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  invitedBy: integer('invited_by'),
});

export const usersRelations = relations(users, ({ one }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
}));
```

Foreign key in separate table (user has profile info):
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}));

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  metadata: jsonb('metadata'),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, { fields: [profileInfo.userId], references: [users.id] }),
}));
// user.profileInfo is nullable
```

## One-to-Many Relations
Define with `many()` operator on the parent side and `one()` on the child side.

Users with posts and posts with comments:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id'),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text'),
  authorId: integer('author_id'),
  postId: integer('post_id'),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
```

## Many-to-Many Relations
Require explicit junction/join tables that store associations between related tables.

Users and groups with junction table:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    groupId: integer('group_id').notNull().references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
```

## Relations vs Foreign Keys
Relations are application-level abstractions; foreign keys are database-level constraints. Relations don't affect the database schema or create foreign keys implicitly. They can be used independently or together, allowing relations to work with databases that don't support foreign keys.

## Foreign Key Actions
Specify actions when referenced data in parent table is modified using the `references()` second argument:

```ts
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';

// In column definition:
author: integer('author').references(() => users.id, { onDelete: 'cascade' }).notNull(),

// In foreignKey operator:
foreignKey({
  name: "author_fk",
  columns: [table.author],
  foreignColumns: [users.id],
})
  .onDelete('cascade')
  .onUpdate('cascade')
```

Actions:
- `CASCADE`: Delete/update parent row also deletes/updates all child rows
- `NO ACTION`: Prevents deletion of parent row if dependent child rows exist (default)
- `RESTRICT`: Same as NO ACTION, included for compatibility
- `SET DEFAULT`: Sets foreign key column to default value when parent row deleted
- `SET NULL`: Sets foreign key column to NULL when parent row deleted (requires nullable column)

ON UPDATE works the same way as ON DELETE, with CASCADE copying updated values to referencing rows.

## Disambiguating Relations
Use `relationName` option to distinguish multiple relations between the same two tables:

```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  author: many(posts, { relationName: 'author' }),
  reviewer: many(posts, { relationName: 'reviewer' }),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id'),
  reviewerId: integer('reviewer_id'),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  reviewer: one(users, {
    fields: [posts.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
}));
```