## Remote Functions

Type-safe client-server communication via `.remote.js/.ts` files. Four types: `query` (read), `form` (write with progressive enhancement), `command` (write from anywhere), `prerender` (build-time static data).

Enable: `kit.experimental.remoteFunctions: true` in config.

**query**: Returns Promise-like with `loading`, `error`, `current` or use `await`. Validate args with Standard Schema. Cache per-page. Call `.refresh()` to re-fetch. `query.batch()` batches simultaneous requests.

```js
export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404);
  return post;
});
```

**form**: Schema + callback. Returns object with `method`, `action` for non-JS, progressive enhancement via `enhance`. Fields via `.fields.fieldName.as(type)`. Validate with `.validate()`, `.preflight(schema)`. Get/set values with `.value()`, `.set()`. Sensitive fields use `_` prefix. Single-flight mutations via `.refresh()` or `submit().updates()`.

```js
export const createPost = form(
  v.object({ title: v.pipe(v.string(), v.nonEmpty()), content: v.pipe(v.string(), v.nonEmpty()) }),
  async ({ title, content }) => {
    await db.sql`INSERT INTO post (title, content) VALUES (${title}, ${content})`;
    redirect(303, `/blog/${slug}`);
  }
);
```

**command**: Like form but not element-tied, callable anywhere. Validate args. Update queries via `.refresh()` or `.updates(query)`. Cannot redirect or call during render.

**prerender**: Build-time execution for static data. Cached via Cache API. Specify `inputs` option. Set `dynamic: true` to allow runtime calls.

Validation errors return 400 Bad Request. Customize via `handleValidationError` hook. Use `getRequestEvent()` for cookies/auth. Redirects allowed in query/form/prerender, not command.