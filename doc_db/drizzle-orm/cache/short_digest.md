## Caching Strategy

Drizzle has opt-in caching (default `global: false`) or global caching (`global: true`). Use `.$withCache()` to enable per-query caching.

## Upstash Integration

```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({
    url: '<UPSTASH_URL>',
    token: '<UPSTASH_TOKEN>',
    global: true,
    config: { ex: 60 }
  })
});
```

## Usage

**Opt-in caching (`global: false`):**
```ts
const res = await db.select().from(users).$withCache();
.$withCache({ config: { ex: 60 } })  // override TTL
.$withCache({ tag: 'custom_key' })  // custom key
.$withCache({ autoInvalidate: false })  // disable auto-invalidation
```

**Global caching (`global: true`):**
```ts
const res = await db.select().from(users);  // cached automatically
const res = await db.select().from(users).$withCache(false);  // disable for this query
```

## Invalidation

```ts
await db.$cache.invalidate({ tables: users });
await db.$cache.invalidate({ tables: [users, posts] });
await db.$cache.invalidate({ tags: "custom_key" });
```

Mutations automatically invalidate affected table caches.

## Custom Cache

Extend `Cache` class and implement `strategy()`, `get()`, `put()`, and `onMutate()` methods.

## Limitations

Not supported: raw queries, batch operations, transactions, relational queries, better-sqlite3, Durable Objects, expo sqlite, AWS Data API, views.