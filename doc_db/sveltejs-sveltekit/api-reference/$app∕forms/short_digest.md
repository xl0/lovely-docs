## applyAction
Updates `form` property and `page.status`, redirects to error page on error.

## deserialize
Deserializes form submission responses from fetch requests.

## enhance
Form action that enhances `<form>` elements to work without JavaScript. Intercepts submission via `submit` callback, allows cancellation, and provides default behavior (form updates, redirects, invalidation). Custom callbacks can invoke `update()` with `reset` and `invalidateAll` options.