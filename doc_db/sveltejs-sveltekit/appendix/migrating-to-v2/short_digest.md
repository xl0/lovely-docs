## Key v2 Changes

- `error()` and `redirect()` no longer need `throw`
- Cookies require explicit `path: '/'`
- Top-level promises must be explicitly `await`ed
- `goto()` rejects external URLs; use `window.location.href`
- Paths relative by default; `preloadCode` needs `base` prefix
- `resolvePath` → `resolveRoute` (includes `base` automatically)
- `handleError` receives `status` and `message`
- Dynamic env vars blocked during prerendering
- `use:enhance` callbacks: `form`/`data` → `formElement`/`formData`
- File input forms need `enctype="multipart/form-data"`
- TypeScript: `moduleResolution: "bundler"`, `verbatimModuleSyntax`
- Node 18.13+, svelte@4, vite@5, typescript@5
- `$app/stores` deprecated; migrate to `$app/state`