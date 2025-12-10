## Form actions

Export `actions` from `+page.server.js` to handle `POST` requests from `<form>` elements. Client-side JavaScript is optional; forms work without it.

### Default actions

```js
// src/routes/login/+page.server.js
export const actions = {
	default: async (event) => {
		// handle POST
	}
};
```

```svelte
<!-- Invokes default action on /login -->
<form method="POST">
	<input name="email" type="email">
	<input name="password" type="password">
	<button>Log in</button>
</form>

<!-- Invoke from another page -->
<form method="POST" action="/login">
	<!-- content -->
</form>
```

### Named actions

Multiple actions per page:

```js
export const actions = {
	login: async (event) => { /* ... */ },
	register: async (event) => { /* ... */ }
};
```

Invoke with query parameter:
```svelte
<form method="POST" action="?/register">
	<!-- content -->
</form>

<!-- From another page -->
<form method="POST" action="/login?/register">
	<!-- content -->
</form>

<!-- Use formaction on button -->
<form method="POST" action="?/login">
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

> Cannot mix default and named actions on same page (query parameter would persist in URL).

### Anatomy of an action

Actions receive `RequestEvent`. Read form data with `request.formData()`. Return data available as `form` prop on page and `page.form` app-wide until next update.

```js
import * as db from '$lib/server/db';

export async function load({ cookies }) {
	const user = await db.getUserFromSession(cookies.get('sessionid'));
	return { user };
}

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		return { success: true };
	}
};
```

```svelte
<script>
	let { data, form } = $props();
</script>

{#if form?.success}
	<p>Successfully logged in! Welcome back, {data.user.name}</p>
{/if}
```

### Validation errors

Use `fail(status, data)` to return HTTP status code (typically 400 or 422) with validation errors. Status available via `page.status`, data via `form`:

```js
import { fail } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const user = await db.getUser(email);

		if (!user || user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user), { path: '/' });
		return { success: true };
	}
};
```

```svelte
<form method="POST" action="?/login">
	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
	<label>
		Email
		<input name="email" type="email" value={form?.email ?? ''}>
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

Returned data must be JSON-serializable. Structure is up to you; use `id` property to distinguish multiple forms.

### Redirects

Use `redirect(status, location)` to redirect after action:

```js
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await db.getUser(email);
		if (!user) {
			return fail(400, { email, missing: true });
		}

		if (user.password !== db.hash(password)) {
			return fail(400, { email, incorrect: true });
		}

		cookies.set('sessionid', await db.createSession(user), { path: '/' });

		if (url.searchParams.has('redirectTo')) {
			redirect(303, url.searchParams.get('redirectTo'));
		}

		return { success: true };
	}
};
```

## Loading data

After action runs, page re-renders (unless redirect/error) with action's return value as `form` prop. Page's `load` functions run after action completes.

`handle` runs before action and doesn't rerun before `load` functions. If using `handle` to populate `event.locals` from cookie, update `event.locals` when setting/deleting cookie in action:

```js
// src/hooks.server.js
export async function handle({ event, resolve }) {
	event.locals.user = await getUser(event.cookies.get('sessionid'));
	return resolve(event);
}
```

```js
// src/routes/account/+page.server.js
export function load(event) {
	return { user: event.locals.user };
}

export const actions = {
	logout: async (event) => {
		event.cookies.delete('sessionid', { path: '/' });
		event.locals.user = null;
	}
};
```

## Progressive enhancement

### use:enhance

Add `use:enhance` action to progressively enhance form without full-page reload:

```svelte
<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<form method="POST" use:enhance>
	<!-- content -->
</form>
```

> `use:enhance` requires `method="POST"` and actions in `+page.server.js`. Won't work with `method="GET"` or `+server.js` endpoints.

Without arguments, `use:enhance`:
- Updates `form`, `page.form`, `page.status` on success/invalid response (only if action on same page)
- Resets `<form>` element
- Invalidates all data on success
- Calls `goto` on redirect
- Renders nearest `+error` boundary on error
- Resets focus

### Customising use:enhance

Provide `SubmitFunction` to customize behavior:

```svelte
<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// formElement: this <form>
		// formData: FormData object being submitted
		// action: URL form posts to
		// cancel(): prevent submission
		// submitter: HTMLElement that caused submission

		return async ({ result, update }) => {
			// result: ActionResult object
			// update: triggers default post-submission logic
		};
	}}
>
```

Override default behavior by returning callback. Call `update` to restore defaults, or use `applyAction`:

```svelte
<script>
	import { enhance, applyAction } from '$app/forms';
	let { form } = $props();
</script>

<form
	method="POST"
	use:enhance={({ formElement, formData, action, cancel }) => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	}}
>
```

`applyAction(result)` behavior by `result.type`:
- `success`, `failure`: sets `page.status` to `result.status`, updates `form` and `page.form` to `result.data` (works regardless of submission origin)
- `redirect`: calls `goto(result.location, { invalidateAll: true })`
- `error`: renders nearest `+error` boundary with `result.error`

All cases reset focus.

### Custom event listener

Implement progressive enhancement manually:

```svelte
<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	let { form } = $props();

	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget, event.submitter);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>
	<!-- content -->
</form>
```

Must `deserialize` response (not `JSON.parse`) because actions support `Date` and `BigInt`.

To `POST` to `+page.server.js` action when `+server.js` exists alongside, use header:

```js
const response = await fetch(this.action, {
	method: 'POST',
	body: data,
	headers: {
		'x-sveltekit-action': 'true'
	}
});
```

## Alternatives

Form actions are preferred (progressively enhanced), but can also use `+server.js` for JSON API:

```svelte
<script>
	function rerun() {
		fetch('/api/ci', { method: 'POST' });
	}
</script>

<button onclick={rerun}>Rerun CI</button>
```

```js
// src/routes/api/ci/+server.js
export function POST() {
	// do something
}
```

## GET vs POST

Use `method="POST"` to invoke form actions. For forms that don't POST (e.g., search), use `method="GET"` or no method. SvelteKit treats them like `<a>` elements, using client-side router without full page navigation:

```html
<form action="/search">
	<label>
		Search
		<input name="q">
	</label>
</form>
```

Submitting navigates to `/search?q=...`, invokes load function, but not action. Supports `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll` attributes.