## PostgreSQL
```ts
tags: text('tags').array().notNull().default(sql`'{}'::text[]`)
```

## MySQL
```ts
tags: json('tags').$type<string[]>().notNull().default([])
// or
tags: json('tags').$type<string[]>().notNull().default(sql`(JSON_ARRAY())`)
```

## SQLite
```ts
tags: text('tags', { mode: 'json' }).notNull().$type<string[]>().default(sql`(json_array())`)
```

Use `.$type<..>()` for compile-time type safety on json columns.