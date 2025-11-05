## Expected Errors

Use the `error` helper from `@sveltejs/kit` to throw expected errors:

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);
	if (!post) {
		error(404, 'Not found');
	}
	return { post };
}
```

This sets the response status code and renders the nearest `+error.svelte` component where `page.error` contains the error object. You can pass either an object with `message` and custom properties, or just a string.

To add custom properties to errors, declare an `App.Error` interface in `src/app.d.ts`:

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

## Unexpected Errors

Any other exception during request handling is an unexpected error. These are logged but not exposed to users (to avoid leaking sensitive info). Users see a generic `{ "message": "Internal Error" }` instead.

Process unexpected errors in the `handleError` hook to add custom handling, send to error reporting services, or return a custom error object.

## Error Responses

If an error occurs in `handle` or `+server.js`, SvelteKit responds with either a fallback error page or JSON based on `Accept` headers.

Customize the fallback error page with `src/error.html`:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

SvelteKit replaces `%sveltekit.status%` and `%sveltekit.error.message%` with actual values.

If an error occurs in a `load` function during page rendering, SvelteKit renders the nearest `+error.svelte` component. Exception: errors in root `+layout.js` or `+layout.server.js` use the fallback error page since the root layout would contain the error component.