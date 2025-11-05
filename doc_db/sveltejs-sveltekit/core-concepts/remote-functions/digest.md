Remote functions enable type-safe client-server communication. They're exported from `.remote.js` or `.remote.ts` files and always execute on the server, allowing safe access to server-only modules like databases and environment variables.

**Setup**: Enable in `svelte.config.js`:
```js
kit: { experimental: { remoteFunctions: true } },
compilerOptions: { experimental: { async: true } }
```

**query**: Reads dynamic data from server. Accepts optional validation schema and returns a Promise. Supports `loading`, `error`, `current` properties or `await`. Can be refreshed via `.refresh()` method. Queries are cached per page.

```js
export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404);
  return post;
});
```

**query.batch**: Batches multiple simultaneous calls into one server request. Callback receives array of arguments and returns a function that maps each input to output.

```js
export const getWeather = query.batch(v.string(), async (cities) => {
  const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
  const lookup = new Map(weather.map(w => [w.city, w]));
  return (city) => lookup.get(city);
});
```

**form**: Writes data to server. Takes validation schema and callback receiving form data. Returns object with `method`, `action`, and `fields` properties. Fields use `.as(type)` to generate input attributes. Supports nested objects/arrays, files, and validation.

```js
export const createPost = form(
  v.object({ title: v.pipe(v.string(), v.nonEmpty()), content: v.pipe(v.string(), v.nonEmpty()) }),
  async ({ title, content }) => {
    await db.sql`INSERT INTO post (title, content) VALUES (${title}, ${content})`;
    redirect(303, `/blog/${slug}`);
  }
);
```

Field validation: `createPost.fields.title.issues()` returns validation errors. Call `createPost.validate()` programmatically. Use `.preflight(schema)` for client-side validation. Sensitive fields use leading underscore (e.g., `_password`) to prevent repopulation on error.

Single-flight mutations: Refresh specific queries after form submission either server-side with `await getPosts().refresh()` or client-side with `submit().updates(getPosts())`. Use `.withOverride()` for optimistic updates.

Multiple form instances: Use `.for(id)` to create isolated instances for repeated forms.

**command**: Like form but not tied to an element, callable from anywhere. Cannot be called during render. Requires explicit query updates via `.refresh()` or `.updates()`.

```js
export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
  getLikes(id).refresh();
});
```

**prerender**: Invokes at build time for static data. Accepts validation schema and optional `inputs` array specifying which arguments to prerender. Set `dynamic: true` to allow runtime calls with non-prerendered arguments.

```js
export const getPost = prerender(v.string(), async (slug) => { /* ... */ }, {
  inputs: () => ['first-post', 'second-post']
});
```

**Validation**: Pass Standard Schema (Zod, Valibot) as first argument. Use `invalid()` function for programmatic validation errors. Implement `handleValidationError` hook to customize error responses. Pass `'unchecked'` to skip validation.

**getRequestEvent**: Access current RequestEvent inside remote functions for cookies and auth. Note: `route`, `params`, `url` relate to the calling page, not the endpoint.