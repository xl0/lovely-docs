## Caching Strategy

Drizzle sends every query to the database by default with no automatic caching. Caching is opt-in to prevent hidden performance traps. Two strategies are available:
- `explicit` (default, `global: false`): Cache only when explicitly requested via `.$withCache()`
- `all` (`global: true`): All select queries check cache first

## Upstash Integration

Drizzle provides `upstashCache()` helper that auto-configures from environment variables:

```ts
import { upstashCache } from "drizzle-orm/cache/upstash";
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache(),
});
```

With explicit configuration and options:

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({
    url: '<UPSTASH_URL>',
    token: '<UPSTASH_TOKEN>',
    global: true,  // cache all queries by default
    config: { ex: 60 }  // 60 second TTL
  })
});
```

## Cache Config

Upstash cache config options:
- `ex`: Expiration in seconds (positive integer)
- `hexOptions`: HEXPIRE command options for hash field TTL ("NX", "XX", "GT", "LT", case-insensitive)

## Usage Examples

**With `global: false` (opt-in, default):**

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({ url: "", token: "" }),
});

// Won't use cache
const res = await db.select().from(users);

// Use cache with .$withCache()
const res = await db.select().from(users).$withCache();

// .$withCache() options:
.$withCache({ config: { ex: 60 } })  // override TTL
.$withCache({ tag: 'custom_key' })  // custom cache key
.$withCache({ autoInvalidate: false })  // disable auto-invalidation
```

**With `global: true`:**

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({ url: "", token: "", global: true }),
});

// Uses cache automatically
const res = await db.select().from(users);

// Disable cache for specific query
const res = await db.select().from(users).$withCache(false);
```

## Cache Invalidation

Manual invalidation via `db.$cache.invalidate()`:

```ts
// By table reference
await db.$cache.invalidate({ tables: users });
await db.$cache.invalidate({ tables: [users, posts] });

// By table name string
await db.$cache.invalidate({ tables: "usersTable" });
await db.$cache.invalidate({ tables: ["usersTable", "postsTable"] });

// By custom tags
await db.$cache.invalidate({ tags: "custom_key" });
await db.$cache.invalidate({ tags: ["custom_key", "custom_key1"] });
```

Mutations (insert, update, delete) automatically trigger `onMutate` handler and invalidate cached queries involving affected tables.

## Eventual Consistency

When `autoInvalidate: false` is set, cache won't invalidate on mutations. Data remains stale until TTL expires. Useful for data that changes infrequently (product listings, blog posts) where slight staleness is acceptable.

Example: Query cached with 3-second TTL and `autoInvalidate: false` will show old data for up to 3 seconds after an insert.

## Custom Cache Implementation

Extend the `Cache` class to implement custom caching:

```ts
export class TestGlobalCache extends Cache {
  private globalTtl: number = 1000;
  private usedTablesPerKey: Record<string, string[]> = {};

  constructor(private kv: Keyv = new Keyv()) {
    super();
  }

  override strategy(): "explicit" | "all" {
    return "all";
  }

  override async get(key: string): Promise<any[] | undefined> {
    return (await this.kv.get(key)) ?? undefined;
  }

  override async put(
    key: string,
    response: any,
    tables: string[],
    config?: CacheConfig,
  ): Promise<void> {
    const ttl = config?.px ?? (config?.ex ? config.ex * 1000 : this.globalTtl);
    await this.kv.set(key, response, ttl);
    for (const table of tables) {
      const keys = this.usedTablesPerKey[table];
      if (keys === undefined) {
        this.usedTablesPerKey[table] = [key];
      } else {
        keys.push(key);
      }
    }
  }

  override async onMutate(params: {
    tags: string | string[];
    tables: string | string[] | Table<any> | Table<any>[];
  }): Promise<void> {
    const tagsArray = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tablesArray = Array.isArray(params.tables) ? params.tables : param.tables ? [params.tables] : [];
    const keysToDelete = new Set<string>();

    for (const table of tablesArray) {
      const tableName = is(table, Table) ? getTableName(table) : (table as string);
      const keys = this.usedTablesPerKey[tableName] ?? [];
      for (const key of keys) keysToDelete.add(key);
    }

    for (const tag of tagsArray) {
      await this.kv.delete(tag);
    }
    for (const key of keysToDelete) {
      await this.kv.delete(key);
      for (const table of tablesArray) {
        const tableName = is(table, Table) ? getTableName(table) : (table as string);
        this.usedTablesPerKey[tableName] = [];
      }
    }
  }
}

const db = drizzle(process.env.DB_URL!, { cache: new TestGlobalCache() });
```

Custom cache config options:
- `ex`: Expiration in seconds
- `px`: Expiration in milliseconds
- `exat`: Unix time (seconds) when key expires
- `pxat`: Unix time (milliseconds) when key expires
- `keepTtl`: Retain existing TTL when updating key
- `hexOptions`: HEXPIRE options

## Limitations

**Not supported:**
- Raw queries: `db.execute(sql\`select 1\`)`
- Batch operations in d1 and libsql
- Transactions
- Relational queries: `db.query.users.findMany()`
- better-sqlite3, Durable Objects, expo sqlite drivers
- AWS Data API drivers
- Views

Relational queries, better-sqlite3, Durable Objects, expo sqlite, AWS Data API, and views are temporary limitations that will be addressed soon.