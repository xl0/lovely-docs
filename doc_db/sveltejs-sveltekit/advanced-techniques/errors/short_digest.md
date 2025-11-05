## Expected Errors

Throw with the `error` helper:

```js
import { error } from '@sveltejs/kit';
error(404, 'Not found');
```

Renders nearest `+error.svelte` with `page.error` containing the error object. Customize error shape via `App.Error` interface in `src/app.d.ts`.

## Unexpected Errors

Any other exception is logged but not exposed to users (generic `{ "message": "Internal Error" }` instead). Handle in `handleError` hook.

## Error Responses

Customize fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders. Errors in `load` functions render nearest `+error.svelte`; errors in root layout use fallback page.