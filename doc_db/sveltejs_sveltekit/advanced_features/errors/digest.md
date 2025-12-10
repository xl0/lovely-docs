## Error objects

SvelteKit distinguishes between expected and unexpected errors, both represented as `{ message: string }` objects by default. Additional properties like `code` or `id` can be added (requires TypeScript `Error` interface redefinition).

## Expected errors

Created with the `error()` helper from `@sveltejs/kit`:

```js
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const post = await db.getPost(params.slug);
	if (!post) {
		error(404, { message: 'Not found' });
	}
	return { post };
}
```

This throws an exception caught by SvelteKit, setting the response status code and rendering the nearest `+error.svelte` component where `page.error` contains the error object.

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.error.message}</h1>
```

Custom error shape with TypeScript:

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

Then use: `error(404, { message: 'Not found', code: 'NOT_FOUND', id: '123' })`

Shorthand: `error(404, 'Not found')` passes a string as the second argument.

## Unexpected errors

Any exception occurring during request handling that isn't created with the `error()` helper. These can contain sensitive information, so unexpected error messages and stack traces are not exposed to users.

Default response: `{ "message": "Internal Error" }`

Unexpected errors pass through the `handleError` hook where you can add custom error handling (e.g., sending to a reporting service, returning a custom error object that becomes `$page.error`).

## Responses

If an error occurs inside `handle` or `+server.js`, SvelteKit responds with either a fallback error page or JSON representation depending on the request's `Accept` headers.

Customize the fallback error page with `src/error.html`:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>%sveltekit.error.message%</title>
	</head>
	<body>
		<h1>My custom error page</h1>
		<p>Status: %sveltekit.status%</p>
		<p>Message: %sveltekit.error.message%</p>
	</body>
</html>
```

SvelteKit replaces `%sveltekit.status%` and `%sveltekit.error.message%` with their values.

If an error occurs inside a `load` function while rendering a page, SvelteKit renders the nearest `+error.svelte` component. If the error occurs in a `load` function in `+layout(.server).js`, the closest error boundary is an `+error.svelte` file _above_ that layout.

Exception: errors in the root `+layout.js` or `+layout.server.js` use the fallback error page (since the root layout would ordinarily contain the `+error.svelte` component).

## Type safety

Customize error shape by declaring an `App.Error` interface in `src/app.d.ts`:

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
export {};
```

The `message: string` property is always included.