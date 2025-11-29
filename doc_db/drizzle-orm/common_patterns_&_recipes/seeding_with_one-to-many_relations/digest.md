## Seeding with the `with` Option

The `with` option in Drizzle Seed allows you to generate related data for one-to-many relationships. It requires that tables have a proper one-to-many relationship defined.

### Requirements

To use `with`, you must either:
1. Add a foreign key reference to the child table column (e.g., `authorId: integer('author_id').notNull().references(() => users.id)`)
2. Define explicit relations using `relations()` and include them in the seed function schema

### Basic Usage

For a one-to-many relationship where one user has many posts:

```ts
import { users, posts } from './schema.ts';

await seed(db, { users, posts }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,  // Generate 3 posts per user
        },
    },
}));
```

Schema with foreign key reference:
```ts
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name'),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    authorId: integer('author_id').notNull().references(() => users.id),
});
```

This generates 2 users with 3 posts each (6 posts total), with `author_id` automatically populated.

### Alternative: Using Relations

Instead of foreign keys, you can define relations explicitly:

```ts
import { relations } from "drizzle-orm";

export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));
```

Then include the relation in the seed function:
```ts
await seed(db, { users, posts, postsRelations }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,
        },
    },
}));
```

### Common Errors

**Error: "posts" table doesn't have a reference to "users" table**
- Cause: Missing foreign key reference or relation definition
- Solution: Add `.references(() => users.id)` to the foreign key column or define relations

**Error: "posts" table doesn't have a reference to "users" table** (when trying to generate many users per post)
- Cause: Attempting to use `with` in the wrong direction (many-to-one instead of one-to-many)
- Solution: Reverse the relationship - generate posts under users, not users under posts

**Error: "users" table has self reference**
- Cause: Attempting to use `with` on a self-referencing table (e.g., `reportsTo` field)
- Solution: Self-referencing tables cannot use `with` because you cannot generate multiple related records for a one-to-one relationship

### Supported Databases

PostgreSQL, MySQL, SQLite