## Expected vs Unexpected Errors

**Expected errors** use `error(status, message)` helper, caught by SvelteKit to render `+error.svelte`:

```js
import { error } from '@sveltejs/kit';
export async function load({ params }) {
	if (!post) error(404, 'Not found');
}
```

**Unexpected errors** are unhandled exceptions; only generic `{ message: "Internal Error" }` exposed to users. Pass through `handleError` hook for custom handling.

## Error Shape & Responses

Default error object: `{ message: string }`. Extend with custom properties via TypeScript:

```ts
declare global {
	namespace App {
		interface Error {
			message: string;
			code: string;
			id: string;
		}
	}
}
```

Customize fallback error page with `src/error.html` using `%sveltekit.status%` and `%sveltekit.error.message%` placeholders.

Error in `load` renders nearest `+error.svelte`; error in root layout uses fallback page.