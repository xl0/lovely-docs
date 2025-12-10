## Route announcements

SvelteKit uses client-side routing, which doesn't trigger full page reloads. To compensate for the loss of automatic screen reader announcements, SvelteKit injects a live region that announces the new page name after navigation by reading the `<title>` element.

Every page should have a unique, descriptive title:

```svelte
<svelte:head>
	<title>Todo List</title>
</svelte:head>
```

## Focus management

In traditional server-rendered apps, navigation resets focus to the top of the page. SvelteKit simulates this by focusing the `<body>` element after navigation and enhanced form submissions, unless an element with the `autofocus` attribute is present.

Customize focus management with the `afterNavigate` hook:

```js
import { afterNavigate } from '$app/navigation';

afterNavigate(() => {
	const to_focus = document.querySelector('.focus-me');
	to_focus?.focus();
});
```

The `goto` function accepts a `keepFocus` option to preserve the currently-focused element instead of resetting focus. Ensure the focused element still exists after navigation to avoid losing focus.

## The "lang" attribute

Set the correct `lang` attribute on the `<html>` element in `src/app.html` for proper assistive technology pronunciation:

```html
<html lang="de">
```

For multi-language content, set `lang` dynamically using the handle hook:

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

## Built-in features

- Svelte's compile-time accessibility checks apply to SvelteKit applications
- SvelteKit provides an accessible foundation, but developers remain responsible for application code accessibility