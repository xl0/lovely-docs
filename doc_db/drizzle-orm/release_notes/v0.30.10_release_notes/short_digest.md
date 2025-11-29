## New Features
- Added `.if()` method to WHERE expressions for conditional filtering:
```ts
.where(gt(posts.views, views).if(views > 100))
```

## Bug Fixes
- Fixed AWS DataAPI session method mappings for `.all()`, `.values()`, `.execute()`