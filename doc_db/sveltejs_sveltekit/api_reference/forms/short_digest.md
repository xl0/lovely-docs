## applyAction
Updates `form` property and `page.status` with action result, redirects to error page on error.

## deserialize
Deserializes form submission response: `deserialize(await response.text())`

## enhance
Enhances `<form>` for progressive enhancement. Custom submit handler receives FormData and action. Default behavior: updates form prop, resets form, invalidates data, handles redirects. Options: `reset: false`, `invalidateAll: false`