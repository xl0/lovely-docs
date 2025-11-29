## Bun SQLite Integration

Install `drizzle-orm` and `drizzle-kit`. Initialize with `drizzle()` for default SQLite or pass a `bun:sqlite` Database instance. Supports both async queries (`await db.select().from(...)`) and sync methods (`.all()`, `.get()`, `.values()`, `.run()`).