## Form actions

Export `actions` from `+page.server.js` to handle `POST` from `<form>`. Works without JavaScript.

### Default and named actions

```js
export const actions = {
	default: async (event) => { /* ... */ },
	login: async (event) => { /* ... */ },
	register: async (event) => { /* ... */ }
};
```

```svelte
<form method="POST"><!-- invokes default --></form>
<form method="POST" action="?/login"><!-- invokes login --></form>
<form method="POST" action="/login?/register"><!-- from another page --></form>
<form method="POST" action="?/login">
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

> Can't mix default and named actions.

### Action anatomy

Receive `RequestEvent`, read `request.formData()`, return data available as `form` prop:

```js
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		
		const user = await db.getUser(email);
		if (!user) return fail(400, { email, missing: true });
		if (user.password !== db.hash(password)) return fail(400, { email, incorrect: true });
		
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
	<p>Logged in! Welcome {data.user.name}</p>
{/if}

<form method="POST" action="?/login">
	{#if form?.missing}<p class="error">Email required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials</p>{/if}
	<input name="email" type="email" value={form?.email ?? ''}>
	<input name="password" type="password">
	<button>Log in</button>
	<button formaction="?/register">Register</button>
</form>
```

Use `fail(status, data)` for validation errors. Use `redirect(status, location)` to redirect.

### Progressive enhancement with use:enhance

```svelte
<script>
	import { enhance, applyAction } from '$app/forms';
	let { form } = $props();
</script>

<!-- Basic: emulates browser behavior without full reload -->
<form method="POST" use:enhance>
	<!-- content -->
</form>

<!-- Custom: override default behavior -->
<form method="POST" use:enhance={({ formElement, formData, action, cancel, submitter }) => {
	return async ({ result, update }) => {
		if (result.type === 'redirect') {
			goto(result.location);
		} else {
			await applyAction(result);
		}
	};
}}>
```

`applyAction(result)`: `success`/`failure` updates `page.status` and `form`; `redirect` calls `goto`; `error` renders `+error` boundary.

### Manual progressive enhancement

```svelte
<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	async function handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget, event.submitter);
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data,
			headers: { 'x-sveltekit-action': 'true' } // if +server.js exists
		});
		const result = deserialize(await response.text());
		if (result.type === 'success') await invalidateAll();
		applyAction(result);
	}
</script>

<form method="POST" onsubmit={handleSubmit}>
```

Must `deserialize` (not `JSON.parse`) to support `Date`/`BigInt`.

### GET vs POST

`method="GET"` (or no method) uses client-side router like `<a>`, invokes load but not action:

```html
<form action="/search">
	<input name="q">
</form>
```

Supports `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll`.