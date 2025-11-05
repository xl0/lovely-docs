## Breaking Changes in v2

**`redirect` and `error` no longer require throwing:**
```js
// v1
throw error(500, 'something went wrong');
// v2
error(500, 'something went wrong');
```

**Cookies require explicit `path`:**
```js
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
```

**Top-level promises no longer auto-awaited:**
```js
// v1 - auto-awaited
export function load({ fetch }) {
  return { response: fetch(url).then(r => r.json()) };
}
// v2 - must explicitly await
export async function load({ fetch }) {
  const response = await fetch(url).then(r => r.json());
  return { response };
}
```

**`goto()` changes:**
- No longer accepts external URLs; use `window.location.href` instead
- `state` object now determines `$page.state` and must adhere to `App.PageState`

**Paths are relative by default:**
- `paths.relative` now defaults to `true` (was inconsistent in v1)
- Affects `%sveltekit.assets%`, `base`, and `assets` from `$app/paths`

**`preloadCode` arguments must be prefixed with `base`:**
- Now takes single argument instead of multiple
- Path must include `base` prefix if set

**`resolvePath` replaced with `resolveRoute`:**
```js
// v1
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });
// v2
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

**Improved error handling:**
- `handleError` hooks now receive `status` and `message` properties
- `message` is safe for user exposure (unlike `error.message`)

**Dynamic environment variables cannot be used during prerendering:**
- Use `$env/static/public` and `$env/static/private` instead
- `$env/dynamic/public` will be fetched from server for prerendered pages

**`use:enhance` callback changes:**
- `form` and `data` properties removed; use `formElement` and `formData`

**Forms with file inputs must use `multipart/form-data`:**
- SvelteKit 2 throws error if missing during `use:enhance` submission

**TypeScript changes:**
- Generated `tsconfig.json` uses `"moduleResolution": "bundler"` and `verbatimModuleSyntax`
- Remove `importsNotUsedAsValues` and `preserveValueImports` from your `tsconfig.json`
- `paths` and `baseUrl` in `tsconfig.json` now trigger warnings; use `alias` config instead

**Dependency requirements:**
- Node 18.13+
- svelte@4, vite@5, typescript@5
- @sveltejs/vite-plugin-svelte@3 (now peer dependency)
- Updated adapter versions

**`$app/stores` deprecated (v2.12+):**
```svelte
// v2.12+
import { page } from '$app/state';
{page.data}
```
Use `npx sv migrate app-state` to auto-migrate.