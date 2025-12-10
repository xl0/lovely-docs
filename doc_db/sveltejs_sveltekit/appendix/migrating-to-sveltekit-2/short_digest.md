## Key Breaking Changes in SvelteKit 2

- **`error()` and `redirect()`**: No longer require `throw` keyword
- **Cookies**: Must explicitly set `path` parameter
- **Load promises**: Top-level promises no longer auto-awaited; use explicit `await` and `Promise.all`
- **`goto()`**: No external URLs; use `window.location.href` instead
- **Paths**: Now relative by default (`paths.relative: true`)
- **`preloadCode`**: Arguments must be prefixed with `base`; takes single argument
- **`resolvePath` → `resolveRoute`**: New function from `$app/paths` that includes `base`
- **Error handling**: `handleError` receives `status` and `message` properties
- **Dynamic env vars**: Cannot be used during prerendering; use static modules instead
- **`use:enhance`**: `form` and `data` properties removed; use `formElement` and `formData`
- **File forms**: Must have `enctype="multipart/form-data"`
- **Dependencies**: Node 18.13+, Svelte 4, Vite 5, TypeScript 5
- **`$app/stores` deprecated**: Migrate to `$app/state` (Svelte 5 runes-based)