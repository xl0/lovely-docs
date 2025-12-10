## Rest Parameters

Use `[...file]` syntax to match variable number of segments:
```
/[org]/[repo]/tree/[branch]/[...file]
```
Request `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` yields:
```js
{ org: 'sveltejs', repo: 'kit', branch: 'main', file: 'documentation/docs/04-advanced-routing.md' }
```

Route `src/routes/a/[...rest]/z/+page.svelte` matches `/a/z` (empty rest), `/a/b/z`, `/a/b/c/z`, etc. Validate rest parameter values using matchers.

### Custom 404 Pages

Rest parameters enable custom 404 handling. Without a catch-all route, nested error pages don't render for unmatched paths:

```tree
src/routes/
├ marx-brothers/
│ ├ [...path]/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```js
// src/routes/marx-brothers/[...path]/+page.js
import { error } from '@sveltejs/kit';
export function load(event) {
	error(404, 'Not Found');
}
```

Unhandled 404s appear in `handleError` hook.

## Optional Parameters

Wrap parameter in double brackets to make optional: `[[lang]]/home` matches both `home` and `en/home`.

Cannot follow rest parameters: `[...rest]/[[optional]]` is invalid (rest is greedy).

## Matching

Restrict parameter values with matchers in `src/params/` directory:

```js
// src/params/fruit.js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```

Use in routes: `src/routes/fruits/[page=fruit]`

Matchers run on server and browser. Test files (`*.test.js`, `*.spec.js`) are excluded from matchers.

## Route Sorting

When multiple routes match a path, SvelteKit sorts by:
1. Specificity (no parameters > dynamic parameters)
2. Matchers (`[name=type]` > `[name]`)
3. `[[optional]]` and `[...rest]` lowest priority unless final segment
4. Alphabetical ties

Example: `/foo-abc` matches these routes in priority order:
```
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[[a=x]]/+page.svelte
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## Encoding

Filesystem and URL-reserved characters require hex escape sequences `[x+nn]`:
- `\` → `[x+5c]`, `/` → `[x+2f]`, `:` → `[x+3a]`, `*` → `[x+2a]`, `?` → `[x+3f]`
- `"` → `[x+22]`, `<` → `[x+3c]`, `>` → `[x+3e]`, `|` → `[x+7c]`
- `#` → `[x+23]`, `%` → `[x+25]`, `[` → `[x+5b]`, `]` → `[x+5d]`, `(` → `[x+28]`, `)` → `[x+29]`

Example: `/smileys/:-)` → `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`

Get hex code: `':'.charCodeAt(0).toString(16)` → `'3a'`

Unicode escapes `[u+nnnn]` (0000-10ffff) also work:
```
src/routes/[u+d83e][u+dd2a]/+page.svelte
src/routes/🤪/+page.svelte
```

For TypeScript compatibility with leading `.` directories, encode: `src/routes/[x+2e]well-known/...`

## Advanced Layouts

### Route Groups

Parenthesized directories don't affect URL pathname, enabling different layouts for different route sets:

```tree
src/routes/
├ (app)/
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
├ (marketing)/
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

`(app)` and `(marketing)` routes have separate layouts; `/admin` skips both group layouts.

### Breaking Out of Layouts

Use `@` suffix on `+page.svelte` or `+layout.svelte` to reset hierarchy to a specific ancestor:

```tree
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page@(app).svelte
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

Options for `/item/[id]/embed`:
- `+page@[id].svelte` - inherits `[id]/+layout.svelte`
- `+page@item.svelte` - inherits `item/+layout.svelte`
- `+page@(app).svelte` - inherits `(app)/+layout.svelte`
- `+page@.svelte` - inherits root `+layout.svelte`

Layouts can also break out: `+layout@.svelte` resets hierarchy for all children.

### Alternatives to Layout Groups

For complex nesting or single outliers, use composition instead:

```svelte
<!--- src/routes/nested/route/+layout@.svelte --->
<script>
	import ReusableLayout from '$lib/ReusableLayout.svelte';
	let { data, children } = $props();
</script>

<ReusableLayout {data}>
	{@render children()}
</ReusableLayout>
```

```js
// src/routes/nested/route/+layout.js
import { reusableLoad } from '$lib/reusable-load-function';
export function load(event) {
	return reusableLoad(event);
}
```