## Link Navigation Attributes

Control SvelteKit link behavior with `data-sveltekit-*` attributes (apply to `<a>` or parent):

- **data-sveltekit-preload-data**: `"hover"` (default) or `"tap"` - preload page data before navigation
- **data-sveltekit-preload-code**: `"eager"` | `"viewport"` | `"hover"` | `"tap"` - preload code only
- **data-sveltekit-reload**: force full-page browser navigation
- **data-sveltekit-replacestate**: use `replaceState` instead of `pushState`
- **data-sveltekit-keepfocus**: retain focus on current element (useful for search forms)
- **data-sveltekit-noscroll**: prevent scroll to top after navigation

Disable with `"false"` value. Respects `navigator.connection.saveData`. Also apply to `<form method="GET">`.