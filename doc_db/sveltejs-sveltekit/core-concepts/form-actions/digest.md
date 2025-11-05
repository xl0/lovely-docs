## Default Actions

Export an `actions` object with a `default` action from `+page.server.js`:

```js
export const actions = {
	default: async (event) => {
		// handle POST
	}
};
```

Use a `<form method="POST">` to invoke it. Invoke from other pages with `<form method="POST" action="/path">`.

## Named Actions

Export multiple named actions instead of default:

```js
export const actions = {
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke with query parameters: `<form method="POST" action="?/register">` or use `formaction` on buttons: `<button formaction="?/register">`.

Cannot mix default and named actions on the same page.

## Processing Form Data

Actions receive a `RequestEvent`. Read form data with `request.formData()`:

```js
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		// process and return data
		return { success: true };
	}
};
```

Return data is available as `form` prop on the page and `page.form` app-wide.

## Validation Errors

Use `fail()` to return HTTP status codes with error data:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		if (!data.get('email')) {
			return fail(400, { email: data.get('email'), missing: true });
		}
	}
};
```

Status is available via `page.status`, data via `form` prop.

## Redirects

Use `redirect()` to redirect after action completes:

```js
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ url }) => {
		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}
	}
};
```

## Progressive Enhancement

Add `use:enhance` directive to progressively enhance forms without full-page reload:

```svelte
<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
```

Customize behavior with a `SubmitFunction`:

```svelte
<form method="POST" use:enhance={({ formData, cancel }) => {
	return async ({ result }) => {
		// handle result
	};
}}>
```

Use `applyAction()` to apply result changes manually. Use `deserialize()` when implementing custom fetch handlers.

## Custom Form Submission

Implement progressive enhancement manually with event listeners:

```svelte
<script>
	import { applyAction, deserialize } from '$app/forms';
	
	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});
		const result = deserialize(await response.text());
		applyAction(result);
	}
</script>

<form onsubmit={handleSubmit}>
```

To POST to `+page.server.js` actions from custom fetch, add header: `'x-sveltekit-action': 'true'`.

## GET vs POST

Use `method="POST"` for actions. Use `method="GET"` (or no method) for forms that don't modify state (like search). GET forms navigate using the client-side router and invoke `load` functions but not actions.