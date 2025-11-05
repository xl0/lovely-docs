## Route announcements
SvelteKit uses client-side routing, so page reloads don't occur. To announce page changes to screen readers, SvelteKit injects a live region that reads the page title. Set unique, descriptive titles using `<svelte:head>`:

```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

## Focus management
SvelteKit focuses the `<body>` element after navigation and form submission, simulating traditional server-rendered behavior. If an element has the `autofocus` attribute, that element is focused instead.

Customize focus management with the `afterNavigate` hook:
```js
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
	const to_focus = document.querySelector('.focus-me');
	to_focus?.focus();
});
```

The `goto` function accepts a `keepFocus` option to preserve the currently-focused element instead of resetting focus.

## Language attribute
Set the `lang` attribute on the `<html>` element in `src/app.html` for correct assistive technology pronunciation:
```html
<html lang="de">
```

For multi-language content, use the server handle hook to set `lang` dynamically:
```html
<!-- src/app.html -->
<html lang="%lang%">
```

```js
// src/hooks.server.js
export function handle({ event, resolve }) {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))
	});
}
```