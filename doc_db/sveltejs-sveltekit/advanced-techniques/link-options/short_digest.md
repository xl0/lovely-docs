Customize `<a>` link behavior with `data-sveltekit-*` attributes:
- **data-sveltekit-preload-data**: `"hover"` or `"tap"` - when to preload page data
- **data-sveltekit-preload-code**: `"eager"`, `"viewport"`, `"hover"`, or `"tap"` - when to preload code
- **data-sveltekit-reload**: force full-page navigation
- **data-sveltekit-replacestate**: replace history instead of push
- **data-sveltekit-keepfocus**: keep focus on current element
- **data-sveltekit-noscroll**: prevent scroll to top

Disable with `"false"` value. Applies to `<form method="GET">` too.