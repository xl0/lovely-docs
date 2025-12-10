## Overview

Remote functions enable type-safe client-server communication. They're exported from `.remote.js` or `.remote.ts` files, automatically transformed to fetch wrappers on the client, and always execute on the server. Four types exist: `query`, `form`, `command`, and `prerender`.

Enable with `kit.experimental.remoteFunctions: true` in `svelte.config.js`, optionally with `compilerOptions.experimental.async: true` for component-level `await`.

## query

Reads dynamic server data. Returns a Promise-like object with `loading`, `error`, `current` properties, or use `await`:

```js
// src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
  const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
  return posts;
});

export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404, 'Not found');
  return post;
});
```

```svelte
<script>
  import { getPosts, getPost } from './data.remote';
  let { params } = $props();
</script>

<h1>Recent posts</h1>
<ul>
  {#each await getPosts() as { title, slug }}
    <li><a href="/blog/{slug}">{title}</a></li>
  {/each}
</ul>

<h1>{(await getPost(params.slug)).title}</h1>
```

Validate arguments with Standard Schema libraries (Zod, Valibot). Both arguments and return values serialize via devalue (handles Date, Map, custom types). Call `.refresh()` to re-fetch. Queries cache per-page: `getPosts() === getPosts()`.

### query.batch

Batches simultaneous requests to solve n+1 problem. Server callback receives array of arguments, must return function `(input, index) => output`:

```js
export const getWeather = query.batch(v.string(), async (cities) => {
  const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
  const lookup = new Map(weather.map(w => [w.city, w]));
  return (city) => lookup.get(city);
});
```

```svelte
{#each cities as city}
  <h3>{city.name}</h3>
  <CityWeather weather={await getWeather(city.id)} />
{/each}
```

## form

Writes data to server. Takes schema and callback receiving FormData-constructed `data`. Returns object with `method`, `action` properties for non-JS fallback, plus progressive enhancement:

```js
export const createPost = form(
  v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    content: v.pipe(v.string(), v.nonEmpty())
  }),
  async ({ title, content }) => {
    const user = await auth.getUser();
    if (!user) error(401, 'Unauthorized');
    const slug = title.toLowerCase().replace(/ /g, '-');
    await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;
    redirect(303, `/blog/${slug}`);
  }
);
```

```svelte
<form {...createPost}>
  <label>
    Title
    <input {...createPost.fields.title.as('text')} />
    {#each createPost.fields.title.issues() as issue}
      <p class="error">{issue.message}</p>
    {/each}
  </label>

  <label>
    Content
    <textarea {...createPost.fields.content.as('text')}></textarea>
  </label>

  <button>Publish</button>
</form>

{#if createPost.result?.success}
  <p>Published!</p>
{/if}
```

### Fields

Access via `form.fields.fieldName`. Call `.as(type)` for input attributes (text, number, checkbox, radio, file, select). Supports nested objects and arrays. Unchecked checkboxes omit values—make optional in schema. For radio/checkbox groups with same field, pass value as second arg: `.as('radio', 'windows')`.

Sensitive fields (passwords, credit cards) use leading underscore to prevent repopulation on validation failure: `_password`.

### Validation

Call `.validate()` programmatically (e.g., `oninput`). By default ignores untouched fields; use `validate({ includeUntouched: true })`. Use `.preflight(schema)` for client-side validation preventing server submission if invalid. Get all issues via `fields.allIssues()`.

Programmatic validation via `invalid()` function for server-side checks:

```js
export const buyHotcakes = form(
  v.object({ qty: v.pipe(v.number(), v.minValue(1)) }),
  async (data, issue) => {
    try {
      await db.buy(data.qty);
    } catch (e) {
      if (e.code === 'OUT_OF_STOCK') {
        invalid(issue.qty(`we don't have enough hotcakes`));
      }
    }
  }
);
```

### Getting/setting inputs

`field.value()` returns current value, auto-updated as user interacts. `form.fields.value()` returns object of all values. Use `.set(...)` to update:

```svelte
<form {...createPost}>
  <!-- -->
</form>

<div class="preview">
  <h2>{createPost.fields.title.value()}</h2>
  <div>{@html render(createPost.fields.content.value())}</div>
</div>

<button onclick={() => createPost.fields.set({ title: 'New', content: 'Lorem...' })}>
  Populate
</button>
```

### Single-flight mutations

By default all queries refresh after successful form submission. For efficiency, specify which queries to refresh. Server-side: call `await getPosts().refresh()` or `await getPost(id).set(result)` in form handler. Client-side: use `enhance` with `submit().updates(...)`.

### enhance

Customize submission with `enhance` callback receiving `{ form, data, submit }`:

```svelte
<form {...createPost.enhance(async ({ form, data, submit }) => {
  try {
    await submit().updates(getPosts());
    form.reset();
    showToast('Published!');
  } catch (error) {
    showToast('Error');
  }
})}>
  <!-- -->
</form>
```

Use `.updates(query)` for single-flight mutations. Use `.withOverride(fn)` for optimistic updates:

```js
await submit().updates(
  getPosts().withOverride((posts) => [newPost, ...posts])
);
```

### Multiple instances

For repeated forms in lists, create isolated instances via `.for(id)`:

```svelte
{#each await getTodos() as todo}
  {@const modify = modifyTodo.for(todo.id)}
  <form {...modify}>
    <!-- -->
    <button disabled={!!modify.pending}>save</button>
  </form>
{/each}
```

### buttonProps

Different buttons can submit to different URLs via `formaction`. Use `form.buttonProps` on button:

```svelte
<form {...login}>
  <input {...login.fields.username.as('text')} />
  <input {...login.fields._password.as('password')} />
  <button>login</button>
  <button {...register.buttonProps}>register</button>
</form>
```

## command

Like `form` but not tied to elements, callable from anywhere. Prefer `form` for graceful degradation. Validate arguments with Standard Schema:

```js
export const getLikes = query(v.string(), async (id) => {
  const [row] = await db.sql`SELECT likes FROM item WHERE id = ${id}`;
  return row.likes;
});

export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
  getLikes(id).refresh();
});
```

```svelte
<button onclick={async () => {
  try {
    await addLike(item.id);
  } catch (error) {
    showToast('Error');
  }
}}>
  add like
</button>

<p>likes: {await getLikes(item.id)}</p>
```

Cannot be called during render. Update queries via `.refresh()` in command, or `.updates(query)` when calling:

```js
await addLike(item.id).updates(getLikes(item.id));
// or with optimistic update:
await addLike(item.id).updates(
  getLikes(item.id).withOverride((n) => n + 1)
);
```

## prerender

Invoked at build time for static data. Results cached via Cache API, survives reloads, cleared on new deployment:

```js
export const getPosts = prerender(async () => {
  const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
  return posts;
});

export const getPost = prerender(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404, 'Not found');
  return post;
});
```

Specify prerender inputs via `inputs` option:

```js
export const getPost = prerender(
  v.string(),
  async (slug) => { /* ... */ },
  {
    inputs: () => ['first-post', 'second-post', 'third-post']
  }
);
```

By default excluded from server bundle—cannot call with non-prerendered arguments. Set `dynamic: true` to allow:

```js
export const getPost = prerender(
  v.string(),
  async (slug) => { /* ... */ },
  {
    dynamic: true,
    inputs: () => ['first-post', 'second-post', 'third-post']
  }
);
```

## Validation errors

SvelteKit returns generic 400 Bad Request for invalid arguments (prevents information leakage to attackers). Customize via `handleValidationError` server hook:

```js
// src/hooks.server.ts
export function handleValidationError({ event, issues }) {
  return { message: 'Nice try, hacker!' };
}
```

Opt out of validation with `'unchecked'` string (use carefully):

```ts
export const getStuff = query('unchecked', async ({ id }: { id: string }) => {
  // bad actors might call with other arguments
});
```

## getRequestEvent

Access current RequestEvent inside `query`, `form`, `command` via `getRequestEvent()` for cookies, etc:

```ts
import { getRequestEvent, query } from '$app/server';

export const getProfile = query(async () => {
  const user = await getUser();
  return { name: user.name, avatar: user.avatar };
});

const getUser = query(async () => {
  const { cookies } = getRequestEvent();
  return await findUser(cookies.get('session_id'));
});
```

Note: cannot set headers (except cookies in `form`/`command`). `route`, `params`, `url` relate to calling page, not endpoint. Queries don't re-run on navigation unless argument changes.

## Redirects

Use `redirect()` inside `query`, `form`, `prerender`. Not allowed in `command` (return `{ redirect: location }` instead).