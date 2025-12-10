## Route announcements
SvelteKit injects a live region to announce page changes via the `<title>` element since client-side routing doesn't reload pages.

## Focus management
SvelteKit focuses `<body>` after navigation (or `autofocus` elements if present). Customize with `afterNavigate()` hook or use `goto()` with `keepFocus` option.

## Language attribute
Set `lang` on `<html>` in `src/app.html`. For multi-language apps, use the handle hook to replace `%lang%` placeholder dynamically.