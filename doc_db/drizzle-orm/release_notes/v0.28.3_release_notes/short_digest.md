## Fixes
- Fixed sqlite-proxy and SQL.js `.get()` response when result is empty

## Features
- **SQLite Simplified Query API**: New simplified query interface for SQLite
- **Column Default Methods**: `.$defaultFn()` / `.$default()` for runtime defaults with custom logic
- **Table Type Inference**: `$inferSelect` / `$inferInsert` methods replacing deprecated `InferModel`
- **Deprecation**: `InferModel` replaced by `InferSelectModel` and `InferInsertModel`
- **Build**: Disabled `.d.ts` files bundling