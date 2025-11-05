Remote functions enable type-safe client-server communication via `.remote.js` files. Four types: **query** (read data, cached, refreshable), **query.batch** (batch multiple queries), **form** (write data with validation and field management), **command** (write data callable from anywhere), **prerender** (build-time static data).

```js
// query
export const getPost = query(v.string(), async (slug) => {
  return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});

// form with fields
export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
  await db.sql`INSERT INTO post VALUES (...)`;
});

// command
export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
  getLikes(id).refresh();
});
```

Enable with `kit.experimental.remoteFunctions: true` in config.