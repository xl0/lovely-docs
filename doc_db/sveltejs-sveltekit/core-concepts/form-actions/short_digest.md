## Default Actions

```js
export const actions = {
	default: async (event) => {}
};
```

Invoke with `<form method="POST">`.

## Named Actions

```js
export const actions = {
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke with `<form method="POST" action="?/register">` or `<button formaction="?/register">`.

## Processing Data

```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		return { success: true };
	}
};
```

Return value available as `form` prop.

## Validation Errors

```js
import { fail } from '@sveltejs/kit';
return fail(400, { email, missing: true });
```

## Redirects

```js
import { redirect } from '@sveltejs/kit';
redirect(303, '/path');
```

## Progressive Enhancement

```svelte
<script>
	import { enhance } from '$app/forms';
</script>
<form method="POST" use:enhance>
```

Customize with `use:enhance={({ formData }) => async ({ result }) => {}}`.

## Custom Submission

```js
const result = deserialize(await response.text());
applyAction(result);
```

Add header `'x-sveltekit-action': 'true'` to POST to actions from custom fetch.