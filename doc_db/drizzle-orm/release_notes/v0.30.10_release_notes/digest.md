## New Features

### `.if()` function for WHERE expressions
Added conditional `.if()` method to all WHERE expressions, enabling conditional query building. Example:

```ts
await db
  .select()
  .from(posts)
  .where(gt(posts.views, views).if(views > 100));
```

This allows WHERE conditions to be applied only when a certain predicate is true, useful for optional filtering based on runtime values.

## Bug Fixes

- Fixed internal mappings for sessions `.all()`, `.values()`, and `.execute()` functions in AWS DataAPI